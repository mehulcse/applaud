import React from "react";
import Badge from '@material-ui/core/Badge';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import {
    faPlus,
    faMinus,
    faCoins
} from "@fortawesome/free-solid-svg-icons";
import AppIcon from "../../components/app-icon";
import {Grid, TextField} from "@material-ui/core";

interface Props {
    count: number;
}

function CoinCounter(props: Props) {
    const { count } = props;

    const [countLocal, setCount] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCount(Number(event.target.value));
    };

    return (
        <Grid container direction="row" alignItems="center" justify="space-between">
            <TextField
                id="outlined-amount"
                label="Coins"
                value={countLocal}
                onChange={handleChange}
                InputProps={{
                    inputProps: {
                        max: 1000, min: 0
                    }
                }}
            />
            <ButtonGroup>
                <Button
                    aria-label="reduce"
                    onClick={() => {
                        setCount(Math.max(countLocal - 5, 0));
                    }}
                >
                    <AppIcon icon={faMinus} />
                </Button>
                <Button
                    aria-label="increase"
                    onClick={() => {
                        setCount(countLocal + 5);
                    }}
                >
                    <AppIcon icon={faPlus} />
                </Button>
            </ButtonGroup>
            <Badge color="primary" badgeContent={countLocal} max={1000} showZero>
                <AppIcon icon={faCoins} size="3x" color="#FFC950"/>
            </Badge>
        </Grid>
    );
}

export default CoinCounter;