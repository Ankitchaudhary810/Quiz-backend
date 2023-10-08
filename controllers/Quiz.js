const Quiz = require("../models/Quiz")


exports.postDrData = async (req, res) => {
  const { doctorName, city, state } = req.body;

  const newDoctor = new Quiz({
    doctorName: doctorName,
    city: city,
    state: state,
  });
  try {
    const data = await newDoctor.save();
    const Id = data._id;
    return res.status(201).json({
      message: 'Doctor data inserted',
      Id
     });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getDoctorName = async (req, res) => {
  try {
    const doctorNames = await Quiz.find({});
    let doctorNameArray = []
    doctorNameArray = doctorNames.map((doc) => doc);
    console.log({ doctorNameArray });

    return res.json(doctorNameArray);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.handleUserDataById = async (req, res) => {
  const userId = req.params.userId;
  try {
    let doctor = []
    doctor = await Quiz.findById(userId);
    console.log({ doctor });

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.handleUserQuizSubmit = async (req, res) => {
  const userId = req.body.userId;
  const totalPoints = req.body.totalPoints;
  const categoryName = req.body.categoryName;
  try {
    const user = await Quiz.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    if (user.QuizCategory && user.QuizCategory[categoryName]) {
      const category = user.QuizCategory[categoryName];

      if (category.isPlayed) {
        return res.status(200).json({ msg: "Category already played" });
      }

      // Update the category as played and set the total points
      category.isPlayed = true;
      category.TotalPoints = totalPoints;

      await user.save();


      const users = await Quiz.find({
        [`QuizCategory.${categoryName}.isPlayed`]: true
      }).select('doctorName QuizCategory').exec();

      // Extract doctor names and scores from the result
      let categoryLeaderboard = []
      categoryLeaderboard = users.map(user => ({
        doctorName: user.doctorName,
        score: user.QuizCategory[categoryName].TotalPoints
      }));

      console.log(categoryLeaderboard);

      return res.status(200).json({
        msg: "QuizCategory updated successfully",
        categoryName,
        categoryLeaderboard
      });
    } else {
      return res.status(404).json({ msg: "Category not found" });
    }
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).json({ msg: "Internal Server Error" });
  }
};



exports.handleLeaderBoardFilter = async (req, res) => {
  const state = req.body.state;
  const categoryName = req.body.categoryName;

  try {
    if (!state || !categoryName) {
      return res.status(400).json({
        msg: "State and categoryName are required"
      });
    }

    // Find all users from the specified state
    const users = await Quiz.find({ state });

    if (!users || users.length === 0) {
      return res.status(404).json({
        msg: "No users found for the given state"
      });
    }

    console.log({state})

    // Filter users by category and isPlayed flag
    const categoryLeaderboard = users
      .filter(user => {
        const category = user.QuizCategory && user.QuizCategory[categoryName];
        return category && category.isPlayed === true;
      })
      .map(user => ({
        doctorName: user.doctorName,
        score: user.QuizCategory[categoryName].TotalPoints
      }));

      console.log({categoryLeaderboard});

    return res.status(200).json({
      msg: "Leaderboard retrieved successfully",
      categoryLeaderboard
    });
  } catch (error) {
    console.error("Error in handleLeaderBoardFilter Route: ", error);
    return res.status(500).json({
      msg: "Internal Server Error"
    });
  }
};




exports.handleLeaderFilterByCategoryName = async (req, res) => {
  const categoryName = req.params.categoryName;

  try {
    if (!categoryName) {
      return res.status(400).json({
        msg: "CategoryName is required"
      });
    }

    // Check if the categoryName exists in the database
    const category = await Quiz.findOne({ [`QuizCategory.${categoryName}`]: { $exists: true } });

    if (!category) {
      return res.status(301).json({
        msg: "CategoryName does not exist in the database"
      });
    }

    // Find all users who have played the specified category
    const users = await Quiz.find({
      [`QuizCategory.${categoryName}.isPlayed`]: true
    }).select('doctorName QuizCategory').exec();

    // Extract doctor names and scores from the result
    let categoryLeaderboard = []
    categoryLeaderboard = users.map(user => ({
      doctorName: user.doctorName,
      score: user.QuizCategory[categoryName].TotalPoints
    }));

    return res.status(200).json({
      msg: "Category leaderboard retrieved successfully",
      categoryLeaderboard
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({
      msg: "Internal Server Error"
    });
  }
};



exports.handleUsersStateAndName = async (req, res) => {
  
  try {
    const doctorDetails = await Quiz.find().select('doctorName state city -_id');
    console.log({ doctorDetails }); 
    return res.json(doctorDetails);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Internal Server Error' , error });
  }
};
