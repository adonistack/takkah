const User = require('../model/User');


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    
  };

exports.getUser = async (req, res) => {
    const { id: _id } = req.params;
    try{
        const user = await User.findById(_id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.updateUser = async (req, res) => {
    const { id: _id } = req.params;
    const updatedUser = req.body;

    try {
        const user = await User.findByIdAndUpdate(_id, updatedUser, { new: true });
        if (!user) res.status(404).send("No user found with that id");
        res.status(200).json(user);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id: _id } = req.params;

    try {
        const result = await User.findByIdAndRemove(_id);
        if (!result) res.status(404).send("No user found with that id");
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
