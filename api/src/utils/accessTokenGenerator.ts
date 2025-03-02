import { JWT_SECRET } from "@/config";
import jwt from "jsonwebtoken";

interface AccessToken {
  id: string;
  name: string;
  verified: boolean;
}

const accessTokenGenerator = (admin: AccessToken) => {
  //   create access token
  const accessToken = jwt.sign(
    {
      id: admin.id,
      name: admin.name,
      verified: admin.verified,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  return accessToken;
};

export default accessTokenGenerator;
