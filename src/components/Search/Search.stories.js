import { Search } from ".";

export default {
  title: "Components/Search",
  component: Search,

  argTypes: {
    variant: {
      options: ["sharp", "filled", "outline"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    variant: "sharp",
  },
};
