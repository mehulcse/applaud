import React, { FunctionComponent, ReactNode } from "react";
import { ApolloError } from "apollo-client";
import { Grid } from "@material-ui/core";
import PaperBox from "./paper-box";
import NoDataAvailable from "./no-data-available";
import Loader from "./loader";
import ErrorCard from "./error-card";
import { LOADER_TYPE } from "../constants/constants";
import PageLayout from "./page-layout";

interface NoDataDetailsCardProps {
  renderBreadcrumb?: () => ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: ApolloError;
}

const NoDataDetailsCard: FunctionComponent<NoDataDetailsCardProps> = (
  props: NoDataDetailsCardProps
) => {
  const { renderBreadcrumb, isLoading, isError, error } = props;

  return (
    <PageLayout appBarContent={renderBreadcrumb && renderBreadcrumb()}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid xs={12} md={10} lg={9} item>
          <PaperBox elevation={5}>
            {isLoading && !isError && <Loader type={LOADER_TYPE.content} />}
            {isError && !isLoading && <ErrorCard error={error} />}
            {!isLoading && !isError && <NoDataAvailable />}
          </PaperBox>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default NoDataDetailsCard;
