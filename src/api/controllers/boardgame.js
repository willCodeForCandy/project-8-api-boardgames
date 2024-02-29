const deleteFileFromCloudinary = require('../../utils/deleteFile');
const Boardgame = require('../models/boardgame');

const getBoardgames = async (req, res, next) => {
  try {
    const allBoardgames = await Boardgame.find().populate('publisher', 'name');
    return res.status(200).json(allBoardgames);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const getBoardgameByNumberOfPlayers = async (req, res, next) => {
  try {
    const { players } = req.params;
    console.log(req.params);
    const requestedBoardgames = await Boardgame.find({
      numberOfPlayers: { $in: Number(players) }
    }).populate('publisher', 'name');
    if (!requestedBoardgames) {
      return res.status(404).json('Game not found');
    }
    return res.status(200).json(requestedBoardgames);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const postBoardgame = async (req, res, next) => {
  try {
    const newBoardgame = new Boardgame(req.body);
    const existingBoardgame = await Boardgame.findOne({
      name: req.body.name
    });
    if (existingBoardgame) {
      return res
        .status(400)
        .json(`${existingBoardgame.name} ya está en la base de datos.`);
    }

    // Si no encuentra otro juego con el mismo nombre, entonces proceso la imagen
    if (req.files) {
      req.files.forEach((file) => {
        newBoardgame.img.push(file.path);
      });
    }
    const savedBoardgame = await newBoardgame.save();
    return res.status(201).json(savedBoardgame);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const editBoardgame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingBoardgame = await Boardgame.findById(id);
    const newBoardgame = new Boardgame(req.body);
    newBoardgame._id = id;
    newBoardgame.numberOfPlayers = [
      ...existingBoardgame.numberOfPlayers,
      ...newBoardgame.numberOfPlayers
    ];
    if (req.file) {
      newBoardgame.img.push(req.file.path);
    }
    newBoardgame.img = [...existingBoardgame.img, ...newBoardgame.img];
    const updatedBoardgame = await Boardgame.findByIdAndUpdate(
      id,
      newBoardgame,
      {
        new: true
      }
    ).populate('publisher', 'name');
    return res.status(200).json({
      message: 'Juego actualizado correctamente',
      usuario: updatedBoardgame
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteBoardgame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBoardgame = await Boardgame.findByIdAndDelete(id);

    deletedBoardgame.img.forEach((url) => {
      deleteFileFromCloudinary(url);
    });

    if (deletedBoardgame) {
      return res
        .status(200)
        .json({ mensaje: 'Juego eliminado', deletedBoardgame });
    } else {
      return res.status(404).json('Juego no encontrado');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  postBoardgame,
  editBoardgame,
  deleteBoardgame,
  getBoardgames,
  getBoardgameByNumberOfPlayers
};
