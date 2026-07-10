import Image from "next/image";
import styled from "styled-components";
import { Parallax } from "react-parallax";
import Typography from "@/components/common/Typography";
import HighlightedText from "@/components/common/HighlightedText";
import { Row, Column, Section, Stack } from "@/components/common/layout";
import Button from "@/components/common/Button";
import HeroImage from "../HeroImage";
import { useRouter } from "next/router";

const ProductIconWrap = styled.div`
  width: 128px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroSection = ({ versionNumber, minimumSystemVersion }) => {
  const router = useRouter();

  return (
    <Parallax
      style={{ overflow: "visible" }}
      renderLayer={(percentage) => {
        return (
          <Section contained gutterTop>
            <Row align="center" style={{ position: "relative", zIndex: 1 }}>
              <Column width={{ md: 12, lg: 12 }}>
                <Stack gap={2} align="center">
                  <ProductIconWrap>
                    <Image
                      width={128}
                      height={128}
                      src="/apple-touch-icon-180x180.png"
                      alt="JereIDE product icon"
                    />
                  </ProductIconWrap>
                  <Typography variant="headline-elevated">
                    A fast and simple editor.
                    <p></p>
                    Open Source.{" "}
                    <HighlightedText>Free Forever.</HighlightedText>
                  </Typography>
                  <Typography
                    variant="intro-elevated"
                    color="tertiary"
                    gutterBottom
                  >
                    JereIDE as an open-source, fast editor built in Rust with
                    built-in LSP features and weekly, sometimes daily, releases.
                  </Typography>
                  <Button size="lg" onClick={() => router.push("/download")}>
                    Download
                  </Button>
                  <Typography variant="body-reduced" color="tertiary">
                    {versionNumber} | macOS{" "}
                    {minimumSystemVersion
                      ? `${minimumSystemVersion.split(".")[0]}+`
                      : ``}
                  </Typography>
                  <Typography variant="body-reduced" color="tertiary">
                    This is an alpha release.
                  </Typography>
                </Stack>
              </Column>
            </Row>
            <Row align="center">
              <Column>
                <HeroImage percentage={percentage} />
              </Column>
            </Row>
          </Section>
        );
      }}
    />
  );
};

export default HeroSection;
