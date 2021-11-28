import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {QuickTaskProps} from "../../util/Types";
import QuickTaskContent from "./QuickTaskContent";
import {Box, Button, Stack} from "@mui/material";
import {requestTaskAssignment} from "../../util/Util";
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const QuickTask = (props: QuickTaskProps) => {
    const {
        id,
        name,
        creatable,
        task,
        expand,
        refreshTasks,
        integrated,
        handleAction,
        excluded
    } = props;
    const [expanded, setExpanded] = useState(false);
    const [isAssigned, setAssigned] = useState(integrated ?? false);

    useEffect(() => {
        setExpanded(expand)
    }, [expand])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleSelectable = () => {
        requestTaskAssignment(id)
            .then(res => setAssigned(true))
            .catch(err => {
                alert(err)
                if (refreshTasks) {
                    refreshTasks()
                }
            })
    }

    const handleAssignment = (value: boolean) => {
        setAssigned(value)
    }

    const isDisabled = () => {
        if (integrated) {
            if (excluded) {
                return false
            } else {
                return true
            }
        } else {
            return isAssigned
        }
    }

    const handleActionClick = () => {
        if (id && handleAction && excluded !== undefined) {
            handleAction(parseInt(id), excluded)
        }
    }

    return (
        <Card>
            <CardHeader
                action={
                    <Stack direction="row" spacing={1}>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            disabled={creatable}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon/>
                        </ExpandMore>
                    </Stack>
                }
                sx={{py: 1, px: 2, background: task.complete ? "lightgrey" : ""}}
                title={name}
                subheader={`ID: ${id}`}
                titleTypographyProps={{variant: "h6"}}
                subheaderTypographyProps={{variant: "caption"}}
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <QuickTaskContent
                        id={id}
                        taskData={task}
                        integrated={integrated}
                        handleAssignment={handleAssignment}
                        isAssigned={isDisabled()}
                        refreshTasks={refreshTasks}/>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default QuickTask
