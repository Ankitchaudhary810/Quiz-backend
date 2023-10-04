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
      const doctorNameArray = doctorNames.map((doc) => doc);
      console.log({doctorNameArray});
  
      return res.json({ doctorNames: doctorNameArray });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.getOnlyName = async(req,res) => {

  try {
    const doctors = await Quiz.find({}, "doctorName"); 

    const doctorNames = doctors.map((doctor) => doctor.doctorName);
    res.json(doctorNames);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

}