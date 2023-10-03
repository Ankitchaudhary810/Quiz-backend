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
      const doctorNames = await Quiz.find({}, 'doctorName');
      const doctorNameArray = doctorNames.map((doc) => doc.doctorName);
  
      return res.json({ doctorNames: doctorNameArray });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };