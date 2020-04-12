import React from "react";
import { Typography, Box, Grid } from "@material-ui/core";
import { ApplaudQueryHookResult } from "../../generated/graphql";
import Loader from "../../components/loader";
import {
  PAGE_LIMIT,
  LOADER_TYPE,
  SCROLL_THRESHOLD
} from "../../constants/constants";
import ApplaudCard from "./applaud-card";
import PaperBox from "../../components/paper-box";
import theme from "../../core/mui-theme";

interface Props {
  queryResult: ApplaudQueryHookResult;
  showName: boolean;
  hideGifs: boolean;
}

class ApplaudSection extends React.Component<Props> {
  private scrollableRef: HTMLElement | null = null;

  componentDidUpdate() {
    window.addEventListener("scroll", this.handleScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { queryResult } = this.props;
    const { loading, data } = queryResult;
    if (
      !loading &&
      data?.applaud?.nodes &&
      data?.applaud.nodes.length < data?.applaud.totalCount &&
      this.scrollableRef &&
      this.scrollableRef.scrollTop >=
        this.scrollableRef.scrollHeight * SCROLL_THRESHOLD
    ) {
      queryResult.fetchMore({
        variables: {
          offset: data?.applaud.nodes.length,
          limit: PAGE_LIMIT
        },
        updateQuery: (
          prev: any,
          { fetchMoreResult }: { fetchMoreResult?: any }
        ) => {
          if (!fetchMoreResult) {
            return prev;
          }
          if (
            prev?.applaud?.nodes &&
            fetchMoreResult &&
            fetchMoreResult.applaud
          ) {
            return Object.assign({}, prev, {
              ...prev,
              applaud: {
                ...prev.applaud,
                nodes: [...prev.applaud.nodes, ...fetchMoreResult.applaud.nodes]
              }
            });
          }
          return prev;
        }
      });
    }
  };

  renderApplauds = () => {
    const { queryResult, showName, hideGifs } = this.props;
    if (
      queryResult?.data?.applaud?.nodes &&
      queryResult.data.applaud.nodes.length > 0
    ) {
      return queryResult.data.applaud.nodes.map((data: any, index: number) => (
        <ApplaudCard
          data={data}
          key={index}
          showName={showName}
          hideGifs={hideGifs}
        />
      ));
    }
    if (!queryResult.loading) {
      return (
        <Box mb={2}>
          <PaperBox elevation={2}>
            <Typography align="center">No Data Available</Typography>
          </PaperBox>
        </Box>
      );
    }
  };

  render() {
    const { queryResult } = this.props;
    const { loading } = queryResult;
    return (
      <Grid
        id="received"
        style={{ padding: `${theme.spacing(2)}, ${theme.spacing(1)}` }}
        className="scrollable-section"
        ref={ref => (this.scrollableRef = ref)}
      >
        {this.renderApplauds()}
        {loading && <Loader type={LOADER_TYPE.card} />}
      </Grid>
    );
  }
}

export default ApplaudSection;
