export { default } from "@/components/pages/download";

export async function getStaticProps() {
  return {
    props: {
      versionNumber: null,
      downloadUrl: null,
    },
  };
}
