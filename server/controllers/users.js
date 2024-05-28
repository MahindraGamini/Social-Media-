import User from '../models/User.js'; // Ensure the correct path to User model

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id); // Corrected method name

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id); // Corrected method name

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(friendId))
        );

        const formattedFriends = friends.map(
            ({ _id, firstname, lastname, occupation, location, picture }) => ({
                _id,
                firstname,
                lastname,
                occupation,
                location,
                picture
            })
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const addRemoveFriend =async(req,res)=>{

    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
    
        if (user.friends.includes(friendId)) {
          user.friends = user.friends.filter((id) => id !== friendId);
          friend.friends = friend.friends.filter((id) => id !== id);
        } else {
          user.friends.push(friendId);
          friend.friends.push(id);
        }
        await user.save();
        await friend.save();
    
        const friends = await Promise.all(
          user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
          ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
          }
        );
    
        res.status(200).json(formattedFriends);
      } catch (err) {
        res.status(404).json({ message: err.message });
      }

}