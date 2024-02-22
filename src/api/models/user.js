const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    profilePic: {
      type: String,
      trim: true,
      default:
        'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'
    },
    playedGames: {
      type: [mongoose.Types.ObjectId],
      ref: boardgames
    },
    wantedGames: {
      type: [mongoose.Types.ObjectId],
      ref: boardgames
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

/* Encriptación de contraseña */
userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
