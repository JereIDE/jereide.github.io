import styled from "styled-components";
import { Heart } from "react-feather";
import Typography from "@/components/common/Typography";
import { Grid, GridItem, Section, Stack } from "@/components/common/layout";
import GitHubSvg from "@/assets/github-icon.svg";
import config from "@/data/config";

const GitHubIcon = styled(GitHubSvg)`
  width: 48px;
  height: 48px;
`;

const SocialSection = () => {
  return (
    <Section contained gutterY>
      <Grid columns={{ xs: 1, md: 2, lg: 2 }} gap>
        <GridItem>
          <Stack gap={1} align="center" style={{ textAlign: "center" }}>
            <GitHubIcon />
            <Typography variant="headline-body">Start Contributing</Typography>
            <Typography variant="body-reduced">
              Help out by creating Issues and PRs. I really need you!
            </Typography>
            <Typography variant="body-reduced">
              <a href={config.links.githubRepo}>Check it out</a>
            </Typography>
          </Stack>
        </GridItem>
        <GridItem>
          <Stack gap={1} align="center" style={{ textAlign: "center" }}>
            <Heart size={48} />
            <Typography variant="headline-body">Support Me</Typography>
            <Typography variant="body-reduced">
              Don&apos;t have time to contribute? You can show your support
              by... using the editor that nobody ever uses.
            </Typography>
          </Stack>
        </GridItem>
      </Grid>
    </Section>
  );
};

export default SocialSection;
