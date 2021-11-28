import React, {useState} from "react";
import {Button, Grid} from "@mui/material";
import QuickTask from "./QuickTask";


type TaskListProps = {
    complete?: boolean,
    selectable?: boolean,
    creatable?: boolean,
    tasks: any[],
    refreshTasks?: () => void
}


const TaskList = (props: TaskListProps) => {
    const {complete, selectable, tasks, creatable, refreshTasks} = props;
    const [expandAll, setExpandAll] = useState(false)

    const listTasks = () => {
        return tasks.map((task: any) => {
                const id = task.id.toString()
                const name = task.stage.name
                const description = task.stage.description
                return (
                    <Grid item key={task.id} sx={{p: 1, width: "100%"}}>
                        <QuickTask
                            id={id}
                            name={name}
                            description={description}
                            complete={complete}
                            selectable={selectable}
                            creatable={creatable}
                            task={task}
                            expand={expandAll}
                            refreshTasks={refreshTasks}
                        />
                    </Grid>
                )
            }
        )
    }

    const handleExpand = () => {
        setExpandAll(!expandAll)
    };

    return (
        <Grid
            container
            direction={creatable ? "row" : "column"}
            alignItems={"center"}
            justifyContent={creatable ? "flex-start" : "center"}
        >
            <Button variant={"contained"} onClick={handleExpand}>
                {expandAll ? "Свернуть все" : "Развернуть все"}
            </Button>
            {listTasks()}
        </Grid>
    )
}

export default TaskList