import React, {useEffect, useState} from "react";
import TaskList from "./TaskList";
import {Box, Grid, Pagination} from "@mui/material";
import {getSelectableTasks, paginatedDataHandler} from "../../util/Util";
import TaskFilter from "./TaskFilter";


type RouterParams = { campaignId: string }

const TaskMenu = (props: any) => {
    const [selectableTasks, setSelectableTasks] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = React.useState(1);
    const [filterData, setFilterData] = useState<object | null>(null)

    const campaignId = "4"

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        if (value) {
            getSelectableTasks(campaignId, value, filterData).then(res => paginatedDataHandler(res, setSelectableTasks, setTotalPages))
        }
    };

    const refreshTasks = () => {
        getSelectableTasks(campaignId,1, filterData).then(res => paginatedDataHandler(res, setSelectableTasks, setTotalPages))
    };

    const getFilter = (query?: string, stage?: string) => {
        console.log(query, stage)
        const filter = query || stage ? {query: query, stage: stage} : null
        getSelectableTasks(campaignId,1, filter).then(res => {
            if (res.count > 0) {
                setFilterData(filter)
                setPage(1)
                paginatedDataHandler(res, setSelectableTasks, setTotalPages)
            } else {
                setFilterData(null)
                alert("Нет похожих тасков")
            }
        })
    }

    useEffect(() => {
        refreshTasks()
    }, []);


    return (
        <Grid sx={{width: '70%', minWidth: '400px', margin: '0 auto', display: 'block'}}>
            <Box pb={2}>
                <TaskFilter campaign={campaignId} onFilter={getFilter}/>
            </Box>
            <TaskList selectable={true} tasks={selectableTasks} refreshTasks={refreshTasks}/>
            <Box pb={2} display={"flex"} justifyContent={"center"}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} showFirstButton
                            showLastButton/>
            </Box>
        </Grid>
    )
}

export default TaskMenu