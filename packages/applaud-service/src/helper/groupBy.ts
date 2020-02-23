export const groupBy = (array: any, key: string) => {
  return array.reduce((result: any, currentValue: any) => {
    if (result[currentValue[key]]) {
      result[currentValue[key]] = {
        ...result[currentValue[key]],
        teamIds: [...result[currentValue[key]].teamIds, currentValue.teamId]
      };
    } else {
      result[currentValue[key]] = {
        balance: currentValue.balance,
        teamIds: [currentValue.teamId]
      };
    }
    return result;
  }, {});
};
