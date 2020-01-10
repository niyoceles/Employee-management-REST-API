class inputValidation {
  static async validateInput(req, res, next) {
    const { phoneNumber, nationalId, email, birthDate } = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    let phoneRegex;
    if (phoneNumber === undefined) {
      phoneRegex = /^\w+$/;
    } else if (phoneNumber === '') {
      phoneRegex = /^[0-9]*$/;
    } else {
      phoneRegex = /^\+2507(?:[0-9] ?){7,7}[0-9]$/;
    }

    let today = new Date();
    let myBirthday = new Date(birthDate);
    let age = today.getFullYear() - myBirthday.getFullYear();
    let m = today.getMonth() - myBirthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < myBirthday.getDate())) {
      age--;
    }

    switch (true) {
      case nationalId === null || nationalId === undefined:
        return res.status(400).json({
          error: 'A valid national Id is required'
        });

      case birthDate === null || birthDate === undefined:
        return res.status(400).json({
          error: 'A valid birth date are required'
        });

      case email === null || email === undefined:
        return res.status(400).json({
          error: 'A valid email is required'
        });
      case phoneNumber === null || phoneNumber === undefined:
        return res.status(400).json({
          error: 'A valid phone number is required'
        });

      case phoneRegex.test(phoneNumber) === false:
        return res.status(400).json({
          error: 'Provide a valid phone number, i.e:+250783067644'
        });

      case nationalId.length < 16 ||
        nationalId.length > 16 ||
        typeof nationalId === 'number':
        return res.status(400).json({
          error: [
            'national Id should be 16 characters',
            'national Id should not be numeric'
          ]
        });

      case emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g names@yahoo.com'
        });

      case isNaN(age):
        return res.status(400).json({
          error: 'please enter a valid date e.g 1990/02/01 or 1990.02.01'
        });
      case age < 18:
        return res.status(400).json({
          error: 'Not eligable, age is under 18 years old'
        });
    }
    next();
  }
}

export default inputValidation;
