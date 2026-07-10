export { default } from "@/components/pages/home";

export async function getStaticProps() {
  return {
    props: {
      versionNumber: null,
      minimumSystemVersion: "12",
    },
  };
}
