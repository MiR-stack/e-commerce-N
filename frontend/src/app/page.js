import Home3Main from "@/components/layout/main/Home3Main";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export default async function Home() {
  return (
    <PageWrapper headerStyle={5} footerBg={"light"}>
      <Home3Main />
    </PageWrapper>
  );
}
