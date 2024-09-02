
import { Heading, Flex, Text } from '@aws-amplify/ui-react';

const Hero = () => (
  <Flex
    direction="column"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    padding="2rem"
    textAlign="center"
  >
    <Heading level={1} color="black">AI-Powered Image Gallery</Heading>
    <Text fontSize="large" color="black" marginTop="1rem">
      Upload images and explore the AI-generated tags they produce in a collaborative gallery-esque fashion.
    </Text>
  </Flex>
);

export default Hero;
