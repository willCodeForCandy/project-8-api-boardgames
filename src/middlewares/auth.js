const User = require('../api/models/user');
const { verifyJwt } = require('../utils/jwt');

const isLogedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res
        .status(400)
        .json('No estás autorizado para realizar esta acción');
    }
    const { id } = verifyJwt(token);
    const user = await User.findById(id);
    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json(error);
  }
};
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(400)
        .json('No estás autorizado para realizar esta acción');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { isLogedIn, isAdmin };
