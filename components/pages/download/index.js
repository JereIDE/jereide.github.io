import React from "react";
import styled from "styled-components";
import { Column, Row, Section, Stack } from "@/components/common/layout";
import Typography from "@/components/common/Typography";
import Image from "next/image";
import Tile from "@/components/common/Tile";
import { mediaQueries } from "@/styles/breakpoints";
import config from "@/data/config";

const StepTile = styled(Tile)`
  overflow: hidden;
  aspect-ratio: 1/1;
  img {
    transform: translateX(-50%);
  }
  @media ${mediaQueries.md} {
    aspect-ratio: 16/7;
  }
  @media ${mediaQueries.sm} {
    aspect-ratio: 1/1;
    img {
      transform: translateX(-50%) translateY(-10%) scale(1.25);
    }
  }
  @media ${mediaQueries.xs} {
    aspect-ratio: 1/1;
    img {
      transform: translateX(-50%) translateY(10%) scale(0.9);
    }
  }
`;
const ProductIconWrap = styled.div`
  width: 128px;
  margin-left: auto;
  margin-right: auto;
`;
const StepNumber = styled.div`
  width: 1.75em;
  height: 1.75em;
  border-radius: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 2.5px solid;
`;
const Download = styled.iframe`
  width: 0;
  height: 0;
  position: fixed;
  top: 100%;
  right: 100%;
  border: 0;
  background: transparent;
  opacity: 0;
`;

/*
 * Auto-download via appcast (disabled):
 *
 * const APPCAST_URL = '...';
 * function parseAppcast(text) { ... }
 *
 * export default function DownloadPage({ downloadUrl }) {
 *   useEffect(() => {
 *     if (downloadUrl) return;
 *     // ... fetches appcast, redirects to enclosure URL
 *   }, [downloadUrl]);
 *   return (
 *     <>
 *       {downloadUrl && <Download src={downloadUrl} />}
 *       <Section ...>
 *         ...
 *         <Typography variant="headline-elevated">
 *           Thanks for downloading JereIDE!
 *         </Typography>
 *         ... (auto-download trigger)
 *       </Section>
 *     </>
 *   );
 * }
 */

export default function DownloadPage() {
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
              Download JereIDE
            </Typography>
            <Typography variant="intro-elevated" color="tertiary" gutterBottom>
              Head over to the <a href="/releases">releases page</a> to download
              the latest version.
            </Typography>
          </Stack>
        </Column>
      </Row>
    </Section>
  );
}
