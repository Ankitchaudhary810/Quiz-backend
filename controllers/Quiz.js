const Quiz = require("../models/Quiz");
const mrModel = require("../models/Mr");
const axios = require("axios");
exports.postDrData = async (req, res) => {
  const { doctorName, city, state, mrId } = req.body;

  let mr = await mrModel.findById({ _id: mrId });
  if (!mr) return res.status(400).json({ msg: "MR Not Found" });

  console.log({ mr });
  const newDoctor = new Quiz({
    doctorName: doctorName,
    city: city,
    state: state,
    mrReference: mr._id
  });

  try {
    const data = await newDoctor.save();
    const Id = data._id;
    return res.status(201).json({
      message: "Doctor data inserted",
      Id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.getDoctorName = async (req, res) => {
  try {
    const doctorNames = await Quiz.find({});
    let doctorNameArray = [];
    doctorNameArray = doctorNames.map((doc) => doc);
    console.log({ doctorNameArray });

    return res.json(doctorNameArray);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.handleUserDataById = async (req, res) => {
  const userId = req.params.userId;
  try {
    let doctor = [];
    doctor = await Quiz.findById(userId);
    console.log({ doctor });

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.handleUserQuizSubmit = async (req, res) => {
//   const userId = req.body.userId;
//   const totalPoints = req.body.totalPoints;
//   const categoryName = req.body.categoryName;
//   try {
//     const user = await Quiz.findById(userId);
//     console.log({ user });
//     if (!user) {
//       return res.status(401).json({ msg: "User not found" });
//     }

//     if (user.QuizCategory && user.QuizCategory[categoryName]) {
//       const category = user.QuizCategory[categoryName];

//       if (category.isPlayed) {
//         return res.status(200).json({ msg: "Category already played" });
//       }

//       // Update the category as played and set the total points
//       category.isPlayed = true;
//       category.TotalPoints = totalPoints;

//       await user.save();
//       const users = await Quiz.find({
//         [`QuizCategory.${categoryName}.isPlayed`]: true,
//       })
//         .select("doctorName QuizCategory")
//         .exec();

//       // Extract doctor names and scores from the result
//       let categoryLeaderboard = [];
//       categoryLeaderboard = users.map((user) => ({
//         doctorName: user.doctorName,
//         score: user.QuizCategory[categoryName].TotalPoints,
//       }));
//       console.log(categoryLeaderboard);
//       return res.status(200).json({
//         msg: "QuizCategory updated successfully",
//         categoryName,
//         categoryLeaderboard,
//       });
//     } else {
//       return res.status(404).json({ msg: "Category not found" });
//     }
//   } catch (error) {
//     console.log("error: ", error);
//     return res.status(400).json({ msg: "Internal Server Error", error });
//   }
// };

exports.handleUserQuizSubmit = async (req, res) => {
  const userId = req.body.userId;
  const totalPoints = req.body.totalPoints;
  const categoryName = req.body.categoryName;

  try {
    const user = await Quiz.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    console.log("Before update - user.quizCategories:", user.quizCategories);

    // Create quizCategories array if it doesn't exist
    if (!user.quizCategories) {
      user.quizCategories = [];
    }

    console.log("After initializing - user.quizCategories:", user.quizCategories);

    // Check if the category exists
    const existingCategory = user.quizCategories.find(
      (category) => category.categoryName === categoryName
    );

    if (!existingCategory) {
      console.log(`Adding new category: ${categoryName}`);
      // If the category doesn't exist, add it to the array
      user.quizCategories.push({
        categoryName,
        isPlayed: false,
        TotalPoints: 0,
      });
    } else if (existingCategory.isPlayed) {
      return res.status(200).json({ msg: "Category already played" });
    }

    console.log("After updating - user.quizCategories:", user.quizCategories);

    // Update the category as played and set the total points
    const updatedCategory = user.quizCategories.find(
      (category) => category.categoryName === categoryName
    );
    updatedCategory.isPlayed = true;
    updatedCategory.TotalPoints = totalPoints;

    await user.save();

    const users = await Quiz.find({
      "quizCategories.categoryName": categoryName,
      "quizCategories.isPlayed": true,
    })
      .select("doctorName quizCategories")
      .exec();

    // Extract doctor names and scores from the result
    let categoryLeaderboard = users.map((user) => ({
      doctorName: user.doctorName,
      score: user.quizCategories.find(
        (category) => category.categoryName === categoryName
      ).TotalPoints,
    }));
    console.log(categoryLeaderboard);

    return res.status(200).json({
      msg: "QuizCategory updated successfully",
      categoryName,
      categoryLeaderboard,
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).json({ msg: "Internal Server Error", error });
  }
};




exports.handleLeaderBoardFilter = async (req, res) => {
  const state = req.body.state;
  const categoryName = req.body.categoryName;

  try {
    if (!state || !categoryName) {
      return res.status(400).json({
        msg: "State and categoryName are required",
      });
    }

    // Find all users from the specified state
    const users = await Quiz.find({ state });

    if (!users || users.length === 0) {
      return res.status(404).json({
        msg: "No users found for the given state",
      });
    }

    console.log({ state });

    // Filter users by category and isPlayed flag
    const categoryLeaderboard = users
      .filter((user) => {
        const category = user.QuizCategory && user.QuizCategory[categoryName];
        return category && category.isPlayed === true;
      })
      .map((user) => ({
        doctorName: user.doctorName,
        score: user.QuizCategory[categoryName].TotalPoints,
      }));

    console.log({ categoryLeaderboard });

    return res.status(200).json({
      msg: "Leaderboard retrieved successfully",
      categoryLeaderboard,
    });
  } catch (error) {
    console.error("Error in handleLeaderBoardFilter Route: ", error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

exports.handleLeaderFilterByCategoryName = async (req, res) => {
  const categoryName = req.params.categoryName;
  const { mrId } = req.params
  console.log({ categoryName });
  try {
    if (!categoryName) {
      return res.status(400).json({
        msg: 'CategoryName is required',
      });
    }

    if (!mrId) {
      return res.status(400).json({
        msg: "mrId is required",
      })
    }
    const users = await Quiz.find({
      'quizCategories.categoryName': categoryName,
      'quizCategories.isPlayed': true,
      'mrReference': mrId,
    });

    const categoryLeaderboard = users.map((user) => ({
      doctorName: user.doctorName,
      state: user.state,
      score: user.quizCategories[0].TotalPoints,
    }));

    return res.status(200).json({
      msg: 'Category leaderboard retrieved successfully',
      categoryLeaderboard,
    });
  } catch (error) {
    console.error('error:', error);
    return res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
};


exports.handleUsersStateAndName = async (req, res) => {
  try {
    const doctorDetails = await Quiz.find().select(
      "doctorName state city -_id"
    );
    console.log({ doctorDetails });
    return res.json(doctorDetails);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.handleOnlyNameWithId = async (req, res) => {
  try {
    const { mrId } = req.body;
    const doctors = await Quiz.find({ mrReference: mrId }).select('_id doctorName locality scCode');
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        msg: 'No Doctors Found for the specified MR',
      });
    }

    return res.status(200).json(doctors);
  } catch (e) {
    console.log("error: ");
    return res.status(501).json({
      msg: "Error in handleOnlyNameWithId",
    });
  }
};



exports.handleUserCategory = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(401).json({
        msg: "User Id Required",
      });
    }

    const user = await Quiz.findById(userId).select("quizCategories").lean(); // Adjust the field name to match your schema
    console.log("user", user);

    if (!user) {
      return res.status(401).json({
        msg: "No Game Category Found",
      });
    }

    const userCategories = user.quizCategories;
    const formattedCategories = [];

    for (const category of userCategories) {
      formattedCategories.push({
        categoryName: category.categoryName, // Adjust the property name
        isPlayed: category.isPlayed,
        TotalPoints: category.TotalPoints,
      });
    }



    return res.status(200).json(formattedCategories);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};



exports.handleUserCategoryWithQuestion = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(401).json({
        msg: "User Id Required",
      });
    }

    const user = await Quiz.findById(userId).select("quizCategories").lean();

    if (!user) {
      return res.status(401).json({
        msg: "No Game Category Found",
      });
    }

    const userCategories = user.quizCategories;
    const formattedCategories = [];

    for (const category of userCategories) {
      formattedCategories.push({
        categoryName: category.categoryName,
        isPlayed: category.isPlayed,
        TotalPoints: category.TotalPoints,
      });
    }

    let OnlyActiveCategories = [];
    try {
      const response = await axios.get('https://backup-quiz-server.onrender.com/onlyactivecategories');
      OnlyActiveCategories = response.data;
    } catch (error) {
      console.error(error);
    }

    const onlyFourActiveQuestions = [];

    await Promise.all(OnlyActiveCategories.map(async (Category) => {
      let category = Category.name;
      console.log({ category });

      try {
        const response = await axios.get(`https://backup-quiz-server.onrender.com/api/questionsfour?category=${category}`);
        onlyFourActiveQuestions.push(response.data);
      } catch (error) {
        console.error(error);
      }
    }));

    let MultipleQuestions = [];
    try {
      const response = await axios.get('https://backup-quiz-server.onrender.com/api/questions');
      MultipleQuestions = response.data;
    } catch (error) {
      console.error(error);
    }

    return res.status(200).json({ formattedCategories, OnlyActiveCategories, onlyFourActiveQuestions, MultipleQuestions });
  } catch (error) {
    const err = error.message;
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
      err
    });
  }
};
