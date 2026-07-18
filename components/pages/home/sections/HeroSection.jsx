import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { Parallax } from "react-parallax";
import Typography from "@/components/common/Typography";
import HighlightedText from "@/components/common/HighlightedText";
import { Row, Column, Section, Stack } from "@/components/common/layout";
import { Download } from "react-feather";
import {
  Menu as DropdownMenu,
  MenuItem as DropdownMenuItem,
} from "@/components/common/Menu";
import Button from "@/components/common/Button";
import HeroImage from "../HeroImage";
import { useRouter } from "next/router";

const ProductIconWrap = styled.div`
  width: 128px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroSection = ({ versionNumber }) => {
  const router = useRouter();
  const [latestAssets, setLatestAssets] = useState(null);
  const [latestTag, setLatestTag] = useState(null);
  useEffect(() => {
    fetch("https://api.github.com/repos/JereIDE/JereIDE/releases/latest")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (Array.isArray(data.assets)) {
            setLatestAssets(data.assets);
          }
          if (data.tag_name) {
            setLatestTag(data.tag_name);
          }
        }
      })
      .catch(() => {});
  }, []);

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
                    The ready-to-use, open-source editor that
                    <HighlightedText>nobody uses.</HighlightedText>
                  </Typography>
                  <Typography
                    variant="intro-elevated"
                    color="tertiary"
                    gutterBottom
                  >
                    JereIDE as an open-source, cross-platform editor built in
                    Rust with very frequent updates. Unfortunately, nobody uses
                    it.
                  </Typography>
                  <DropdownMenu
                    trigger={() => (
                      <Button size="lg">
                        <Download
                          style={{
                            width: 18,
                            height: 18,
                            verticalAlign: "middle",
                          }}
                        />
                        Be the first to use it →
                      </Button>
                    )}
                  >
                    {latestAssets?.length > 0 ? (
                      latestAssets.map((asset) => (
                        <DropdownMenuItem
                          key={asset.id}
                          onClick={() =>
                            window.open(asset.browser_download_url, "_blank")
                          }
                        >
                          {asset.name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem
                        onClick={() => {
                          window.location.href = "/releases";
                        }}
                      >
                        View releases
                      </DropdownMenuItem>
                    )}
                  </DropdownMenu>
                  <Typography
                    variant="body-reduced"
                    color="tertiary"
                    style={{ marginBottom: 48 }}
                  >
                    {latestTag || versionNumber || "Latest Stable"}
                    <br />
                    macOS 12+ | Windows 10+
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
