const UserModal = require("../Modals/UserModal");
const { OAuth2Client } = require("google-auth-library");
const https = require("https");
var google = require("googleapis").google;
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2();

// signup the user with providing all the neccessary parameters
const signUpUser = async (req, res) => {
  try {
    const new_user = {
      name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      contact: req.body.mobileNo,
      password: req.body.password,
    };

    //check that the user with the provided email and contact number is valid or not
    const email_check_user = await UserModal.findByEmail(new_user.email);
    const contact_check_user = await UserModal.findByContact(new_user.contact);
    if (!!email_check_user)
      return res
        .status(406)
        .send({ message: "User with given email address is already exist!" });
    if (!!contact_check_user)
      return res
        .status(406)
        .send({ message: "User with given mobile number is already exist!" });
    const user = new UserModal(new_user);
    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

// sign up the user with google credentials
const signUpUserWithGoogle = async (req, res) => {
  try {
    const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);
    // verifing the id token and get the raw data of the user
    oauth2Client.setCredentials({ access_token: req.body.credential });
    var oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const raw_user = await oauth2.userinfo.get();

    const email_check_user = await UserModal.findByEmail(raw_user.data.email);
    if (!!email_check_user)
      return res
        .status(406)
        .send({ message: "This email address already exists" });

    const new_user = {
      name: raw_user.data.given_name,
      last_name: raw_user.data.family_name,
      email: raw_user.data.email,
      image_path: raw_user.data.picture,
      contact: raw_user.data.id,
    };
    const user = new UserModal(new_user);

    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

// sign in the user with email and password
const loginUser = async (req, res) => {
  try {
    const user = await UserModal.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user)
      return res.status(406).send({ message: "Wrong email or password" });
    const token = await user.generateAuthToken();
    return res.status(200).send({ user, token });
  } catch (e) {
    return res.status(400).send({ error: "Authentication Fail" });
  }
};

// sign in the user with google credential
const loginUserWithGoogle = async (req, res) => {
  try {
    // verifing the id token and get the data of the user
    oauth2Client.setCredentials({ access_token: req.body.credential });
    var oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const raw_data = await oauth2.userinfo.get();
    console.log(raw_data);

    const user = await UserModal.findByEmail(raw_data.data.email);
    if (!user) {
      return res
        .status(404)
        .send({ message: "User with this email is not found" });
    }
    user.image_path = raw_data.data.picture;
    await user.save();

    const token = await user.generateAuthToken();
    return res.status(200).send({ user, token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ message: "Authentication Fail" });
  }
};

// logout the user
const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};

// update user data
const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "last_name", "email", "password", "contact"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  signUpUser,
  signUpUserWithGoogle,
  loginUser,
  loginUserWithGoogle,
  logoutUser,
  updateUser,
};
