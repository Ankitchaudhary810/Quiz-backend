const Quiz = require("../models/Quiz");
const mrModel = require("../models/Mr");

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
  try {
    if (!categoryName) {
      return res.status(400).json({
        msg: "CategoryName is required",
      });
    }

    // Check if the categoryName exists in the database
    const category = await Quiz.findOne({
      [`QuizCategory.${categoryName}`]: { $exists: true },
    });

    if (!category) {
      return res.status(301).json({
        msg: "CategoryName does not exist in the database",
      });
    }

    // Find all users who have played the specified category
    const users = await Quiz.find({
      [`QuizCategory.${categoryName}.isPlayed`]: true,
    })
      .select("doctorName QuizCategory state city")
      .exec();




    // Extract doctor names And scores From T`he result
    let categoryLeaderboard = [];
    console.log({ users });
    categoryLeaderboard = users.map((user) => ({
      doctorName: user.doctorName,
      state: user.state,
      city: user.city,
      score: user.QuizCategory[categoryName].TotalPoints,
    }));

    return res.status(200).json({
      msg: "Category leaderboard retrieved successfully",
      categoryLeaderboard,
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({
      msg: "Internal Server Error",
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

    const doctors = await Quiz.find({ mrReference: mrId }).select('_id doctorName');

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

// exports.handleUserCategory = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     if (!userId) {
//       return res.status(401).json({
//         msg: "user Id Required",
//       });
//     }

//     const user = await Quiz.findById(userId).select("QuizCategory").lean();
//     console.log("user", user);

//     if (!user) {
//       return res.status(401).json({
//         msg: "No Game Category Found",
//       });
//     }

//     const userCategories = user.QuizCategory;
//     const formattedCategories = [];

//     for (const category in userCategories) {
//       formattedCategories.push({
//         [category]: {
//           isPlayed: userCategories[category].isPlayed,
//           TotalPoints: userCategories[category].TotalPoints,
//         },
//       });
//     }

//     return res.status(200).json(formattedCategories);
//   } catch (error) {
//     return res.status(501).json({
//       msg: "Internal Server Error",
//     });
//   }
// };


// exports.handleUserCategory = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     if (!userId) {
//       return res.status(401).json({
//         msg: "User Id Required",
//       });
//     }

//     const user = await Quiz.findById(userId).select("QuizCategory").lean();
//     console.log("user", user);

//     if (!user) {
//       return res.status(401).json({
//         msg: "No Game Category Found",
//       });
//     }

//     const userCategories = user.QuizCategory;
//     const formattedCategories = [];

//     for (const category in userCategories) {
//       formattedCategories.push({
//         category: category, // Add the category name
//         isPlayed: userCategories[category].isPlayed,
//         TotalPoints: userCategories[category].TotalPoints,
//       });
//     }

//     return res.status(200).json(formattedCategories);
//   } catch (error) {
//     return res.status(500).json({ // Use 500 for internal server error
//       msg: "Internal Server Error",
//     });
//   }
// };

// const Quiz = require('path_to_your_quiz_model'); // Replace with the actual path

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

    let questions = []
    await fetch(`https://backup-quiz-server.onrender.com/api/questions`, {
      method: "GET"
    }).then(res => res.json()).then(data => {
      console.log("data: ", data);
      questions = data
    });

    // let FourQuestion = []
    // await fetch("https://backup-quiz-server.onrender.com/api/questionfour", {
    //   method: "GET",
    // }).then(res => res.json()).then(data => {
    //   FourQuestion = data
    // });

    // let OnlyActiveCategories = []
    // await fetch("https://backup-quiz-server.onrender.com/onlyactivecategories", {
    //   method: "GET"
    // }).then(res => res.json()).then(data => {
    //   OnlyActiveCategories = data;
    // })

    return res.status(200).json({ formattedCategories, questions });
  } catch (error) {
    const err = error.message;
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      msg: "Internal Server Error",
      err
    });
  }
};


