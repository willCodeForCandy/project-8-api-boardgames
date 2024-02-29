const { generateSign } = require('../../utils/jwt');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find()
      .populate('playedGames', 'name')
      .populate('wantedGames', 'name');
    const publicData = allUsers.map((user) => {
      const publicUser = {
        username: user.username,
        profilePic: user.profilePic,
        playedGames: user.playedGames,
        wantedGames: user.wantedGames,
        isAdmin: user.isAdmin
      };
      return publicUser;
    });
    return res.status(200).json(publicData);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUserByName = async (req, res, next) => {
  try {
    const { username } = req.params;
    const requestedUser = await User.findOne({ username })
      .populate('playedGames', 'name')
      .populate('wantedGames', 'name');
    return res.status(200).json(requestedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const register = async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      profilePic: req.body.profilePic,
      playedGames: req.body.playedGames,
      wantedGames: req.body.wantedGames
    });
    if (req.file) {
      newUser.profilePic = req.file.path;
    }
    if (!newUser.profilePic) {
      newUser.profilePic =
        'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg';
    }
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json('Ese nombre de usuario ya existe');
    }
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username }); //validar user

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //validar password
        const token = generateSign(user._id);

        return res.status(200).json({ user, token });
      } else {
        return res.status(400).json('Usuario o contraseña incorrectos');
      }
    } else {
      return res.status(400).json('Usuario o contraseña incorrectos');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === id || req.user.isAdmin) {
      //Quiero que solo el mismo usuario o un administrador puedan editar los datos del usuario
      const newUser = new User(req.body);
      const existingUser = await User.findById(id);
      newUser._id = id;
      newUser.role = req.user.role; //hago que con esta función no se pueda cambiar el rol
      newUser.playedGames = [
        ...existingUser.playedGames,
        ...newUser.playedGames
      ];
      newUser.wantedGames = [
        ...existingUser.wantedGames,
        ...newUser.wantedGames
      ];
      if (req.file) {
        newUser.profilePic = req.file.path;
      }
      const updatedUser = await User.findByIdAndUpdate(id, newUser, {
        new: true
      });
      return res.status(200).json({
        message: 'Usuario actualizado correctamente',
        usuario: updatedUser
      });
    } else {
      return res
        .status(400)
        .json('No estás autorizado para realizar esta acción');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const manageAdmins = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isAdmin: req.body.isAdmin
      },
      { new: true }
    );
    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      usuario: updatedUser
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      return res
        .status(200)
        .json({ mensaje: 'usuario eliminado', deletedUser });
    } else {
      return res.status(404).json('Usuario no encontrado');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  register,
  login,
  editUser,
  deleteUser,
  getUsers,
  getUserByName,
  manageAdmins
};
