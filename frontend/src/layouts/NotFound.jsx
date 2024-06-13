import { useContext } from "react";
import { Flex, Image, Text, Button } from "@chakra-ui/react";
import image404 from "../assets/svg/404.svg";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NotFound = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleButton = () => {
    if (!user || !user.data) {
        navigate("/");
      } else if (user.data.role === "admin") {
        navigate("/admin");
      } else if (user.data.role === "hr") {
        navigate("/hr");
      } else if (user.data.role === "employee") {
        navigate("/employee");
      } else {
        navigate("/");
      }
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      py={5}
      flexDirection="column"
      gap={5}
    >
      <Image alt="404" objectFit="cover" src={image404} width={500} />
      <Text fontSize="3xl">
        Page not{" "}
        <Text as="span" fontWeight="bold">
          found
        </Text>
      </Text>
      <Button
        leftIcon={<FaChevronLeft />}
        colorScheme="green"
        variant="outline"
        onClick={handleButton}
      >
        Go back
      </Button>
    </Flex>
  );
};

export default NotFound;
