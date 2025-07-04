import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export const hashPassword = async (userValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(userValue, salt);

  return hashedPassword;
};

export const comparePassword = async (userPassword, password) => {   

    try {
        const isMatch = await bcrypt.compare(userPassword, password);
      
        return isMatch
    } catch (error) {
        console.error(error);
    }
}

export const createJWT = (payload) => {
    return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

