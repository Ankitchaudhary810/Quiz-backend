const Quiz = require("../models/Quiz")


exports.postDrData = async (req, res) => {
  const { doctorName, city, state } = req.body;

  const newDoctor = new Quiz({
    doctorName: doctorName,
    city: city,
    state: state,
  });
  try {
    await newDoctor.save();
    return res.status(201).json({ message: 'Doctor data inserted' });
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
  const userId = req.body.userId;
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
        // Category has already been played, return an error message
        return res.status(200).json({ msg: "Category already played" });
      }

      // Update the category as played and set the total points
      category.isPlayed = true;
      category.TotalPoints = totalPoints;

      await user.save();

      // const users = await Quiz.find({
      //   [`QuizCategory.${categoryName}.isPlayed`]: true
      // }).exec();

      const users = await Quiz.find({
        [`QuizCategory.${categoryName}.isPlayed`]: true
      }).select('doctorName QuizCategory').exec();

      // Extract doctor names and scores from the result
      const categoryLeaderboard = users.map(user => ({
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

