declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
  }
declare module "*.png" {
    const content: string; // The content is a string that represents the path to the image
    export default content;
  }