import { fetchWithCache } from "@/utils/fetchData";
export { default } from "@/components/pages/releases";

export async function getStaticProps() {
  const data = await fetchWithCache(
    "releases",
    "https://api.github.com/repos/JereIDE/JereIDE/releases",
  );

  const releases = Array.isArray(data) ? data : [];

  return {
    props: {
      releases,
    },
  };
}
