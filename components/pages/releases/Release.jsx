import React from "react";
import styled from "styled-components";
import {
  Section,
  SectionDivider,
  Row,
  Column,
  Stack,
} from "@/components/common/layout";
import Tile from "@/components/common/Tile";
import Typography from "@/components/common/Typography";
import Button from "@/components/common/Button";
import IconButton from "@/components/common/IconButton";
import { TileViolator } from "@/components/common/Tile";
import { Menu, MenuItem, MenuDivider } from "@/components/common/Menu";
import Markdown from "@/components/common/Markdown";
import { Download, Link, Mail, Share } from "react-feather";
import FacebookSvg from "@/assets/facebook-icon.svg";

import macOSVersions from "@/data/macOS-versions";
import getMinimumSystemVersion from "@/utils/getMinimumSystemVersion";

const ReleaseTile = styled(Tile)`
  border-radius: 18px;
  & > div {
    padding: 30px;
  }
`;
const ReleaseNameLink = styled.a`
  color: inherit;
  position: relative;
  &:after {
    content: "\\00a0#";
    font-weight: 400;
    opacity: 0;
  }
  &:hover {
    opacity: 0.75;
    &:after {
      opacity: 0.33;
    }
  }
`;
const StyledMarkdown = styled(Markdown)`
  img {
    width: 100%;
  }
`;

function formatDate(fullDate) {
  const date = new Date(fullDate);
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    function (data) {
      console.log("Copying to clipboard was successful!", data);
    },
    function (err) {
      console.log("Could not copy text: ", err);
    },
  );
}

const sendInEmail = (name, url) => {
  var subject = `JereIDE Release ${name}`;
  var body = url;
  var uri = "mailto:?subject=";
  uri += encodeURIComponent(subject);
  uri += "&body=";
  uri += encodeURIComponent(body);
  window.open(uri);
};

function formatSize(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

const Release = ({ release, latest }) => {
  const releaseUrl = `${release.html_url ?? ""}#${release.name}`;

  const versionNumber = getMinimumSystemVersion(release.body);
  const versionName = versionNumber
    ? macOSVersions[versionNumber.split(".")[0]]
    : null;

  return (
    <React.Fragment>
      <SectionDivider contained />
      <Section contained gutterTop gutterBottom id={release.name}>
        <Row gap={5}>
          <Column width={{ sm: 12, lg: 4 }}>
            <Stack gap={2} style={{ position: "sticky", top: 96 }}>
              <ReleaseTile>
                <Stack gap>
                  <Stack align="start" gap={1}>
                    {latest && <TileViolator>Latest</TileViolator>}
                    <Typography variant="eyebrow-super" as="h3">
                      <ReleaseNameLink href={`#${release.name}`}>
                        {release.name}
                      </ReleaseNameLink>
                    </Typography>
                    <Typography
                      as="span"
                      variant="body-reduced"
                      color="tertiary"
                    >
                      Released on {formatDate(release.published_at)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="horizontal"
                    align="center"
                    distribute="space-between"
                    style={{ width: "100%" }}
                  >
                    <Menu
                      trigger={() => (
                        <Button>
                          <Download
                            style={{
                              width: 18,
                              height: 18,
                              verticalAlign: "middle",
                            }}
                          />
                          Download
                        </Button>
                      )}
                    >
                      {release.assets?.length > 0 ? (
                        release.assets.map((asset) => (
                          <MenuItem
                            key={asset.id}
                            onClick={() => {
                              window.open(asset.browser_download_url, "_blank");
                            }}
                          >
                            {asset.name}{" "}
                            <Typography
                              as="span"
                              variant="caption"
                              color="tertiary"
                            >
                              ({formatSize(asset.size)})
                            </Typography>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem
                          onClick={() => {
                            window.open(release.html_url, "_blank");
                          }}
                        >
                          View on GitHub
                        </MenuItem>
                      )}
                    </Menu>
                    <Menu
                      trigger={() => (
                        <IconButton>
                          <Share />
                        </IconButton>
                      )}
                    >
                      <MenuItem
                        icon={Link}
                        onClick={() => {
                          copyToClipboard(releaseUrl);
                        }}
                      >
                        Copy Link
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        icon={FacebookSvg}
                        onClick={() =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${releaseUrl}`,
                          )
                        }
                      >
                        Share on Facebook
                      </MenuItem>
                      <MenuItem
                        icon={Mail}
                        onClick={() => sendInEmail(release.name, releaseUrl)}
                      >
                        Send in Email
                      </MenuItem>
                    </Menu>
                  </Stack>
                </Stack>
              </ReleaseTile>
              {versionNumber && (
                <Typography
                  variant="caption"
                  color="tertiary"
                  style={{ margin: "0 30px" }}
                >
                  Requires macOS {versionName} ({versionNumber}) or newer
                </Typography>
              )}
            </Stack>
          </Column>
          <Column width={{ sm: 12, lg: 8 }}>
            <StyledMarkdown>{release.body}</StyledMarkdown>
          </Column>
        </Row>
      </Section>
    </React.Fragment>
  );
};

export default Release;
