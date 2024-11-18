const List = require('../Models/list');
const User = require('../Models/user');
const Movie = require('../Models/movie');


const createList = async (req, res) => {
  try {
    const { title, description, movies } = req.body;
    const creator = req.user._id;

    
    const newList = new List({
      title,
      description,
      creator,
      movies,
    });

    await newList.save();

   
    await User.findByIdAndUpdate(creator, { $push: { 'createdLists': newList._id } });

    res.status(201).json({ message: 'List created successfully', list: newList });
  } catch (error) {
    res.status(500).json({ message: 'Error creating list', error: error.message });
  }
};


const getUserLists = async (req, res) => {
  try {
    const lists = await List.find({ creator: req.user._id });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lists', error: error.message });
  }
};


const followList = async (req, res) => {
  try {
    const { listId } = req.body;
    const userId = req.user._id;

    
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });

    if (list.followers.includes(userId)) {
      return res.status(400).json({ message: 'You are already following this list' });
    }

    
    list.followers.push(userId);
    await list.save();

    res.status(200).json({ message: 'Successfully followed the list' });
  } catch (error) {
    res.status(500).json({ message: 'Error following list', error: error.message });
  }
};


const getUserFollowedLists = async (req, res) => {
  try {
    const userId = req.user._id;
    const lists = await List.find({ followers: userId });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followed lists', error: error.message });
  }
};


const getPublicLists = async (req, res) => {
  try {
    const lists = await List.find({ shared: true });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public lists', error: error.message });
  }
};


const unfollowList = async (req, res) => {
  try {
    const { listId } = req.body;
    const userId = req.user._id;

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });

    
    list.followers.pull(userId);
    await list.save();

    res.status(200).json({ message: 'Successfully unfollowed the list' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing list', error: error.message });
  }
};

module.exports = {
  createList,
  getUserLists,
  followList,
  getUserFollowedLists,
  getPublicLists,
  unfollowList,
};
