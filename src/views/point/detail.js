import { v4 as uuid } from 'uuid';
import React, {Component} from 'react';
import {
  Avatar,
  Box,
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  Tab,
  Tabs,
  AppBar,
  TableHead,
  Typography
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Page from 'src/components/Page';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;

class PointDetail extends Component {

    state = {
        language:JSON.parse(localStorage.language).language,
        pointId: '',
        pointData: {},
        spin: false,
    }; 
 
    handleGoback = (event) =>{
        window.history.back();
    }


    componentDidMount(){
        var path = window.location.href;
        var tokens = path.split("/");
        var id = tokens[tokens.length-1];
        this.setState({pointId:id});
        this.getPointDetailData(id);
    }

    getPointDetailData(id) {
        var userData = JSON.parse(localStorage.userData);
        var token = userData.token;
        var config = {
            method: 'get',
            url: `${baseurl}/api/admin/pointdetail/${id}`,
            headers: {
              'Authorization': 'Bearer ' + token,
            },
            data : {},
        };
        this.setState({
            spin:true
        });
        axios(config)
        .then((response)=>{
            this.setState({
                spin:false,
                pointData: response.data.pointData
            });
        })
        .catch((error)=>{
            if (error.response) {
                if(error.response.status==401){
                    localStorage.removeItem("userData");
                    window.location.assign('/');
                }
            } 
            this.setState({
                spin:false
            });
        })
    }

    render() {
        const {
            pointData,
            language
        } = this.state;
        console.log(pointData)
        return(
            <Page
            className="root"
            title="Akushu|UserDetail"
            >
            <Container maxWidth={false}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                >              
                    <div className="page-title">
                        <a className="before-page" onClick={this.handleGoback} href="#">◀ ポイント送受信一覧</a>
                        <span></span>
                    </div>
                </Box>
                <Box mt={3}>
                    <Card>
                        <CardContent className="tab-Card">
                            <Box p={3}>
                                <Table className="result_table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                送信者
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    alignItems={'center'}
                                                    display={'flex'}
                                                >
                                                    <Avatar className="avatar"
                                                        src={pointData?.sender?.avatar ? `${baseurl}/media/${pointData?.sender?.avatar}`:""}
                                                    >
                                                    </Avatar>
                                                    <Typography
                                                        color="textPrimary"
                                                        variant="body1"
                                                    >
                                                        {pointData?.sender?.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {pointData?.sender?.email}
                                            </TableCell>
                                            <TableCell>
                                                送信額 : {pointData?.point?.sender}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                受信者
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    alignItems={'center'}
                                                    display={'flex'}
                                                >
                                                    <Avatar className="avatar"
                                                        src={pointData?.receiver?.avatar ? `${baseurl}/media/${pointData?.receiver?.avatar}`:""}
                                                    >
                                                    </Avatar>
                                                    <Typography
                                                        color="textPrimary"
                                                        variant="body1"
                                                    >
                                                        {pointData?.receiver?.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {pointData?.receiver?.email}
                                            </TableCell>
                                            <TableCell>
                                                受信額 : {pointData?.point?.receiver}
                                            </TableCell>
                                        </TableRow>
                                        {
                                            pointData?.instructor?
                                            <TableRow>
                                                <TableCell>
                                                    １親等紹介者
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        alignItems={'center'}
                                                        display={'flex'}
                                                    >
                                                        <Avatar className="avatar"
                                                            src={pointData?.instructor?.avatar ? `${baseurl}/media/${pointData?.instructor?.avatar}`:""}
                                                        >
                                                        </Avatar>
                                                        <Typography
                                                            color="textPrimary"
                                                            variant="body1"
                                                        >
                                                            {pointData?.instructor?.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {pointData?.instructor?.email}
                                                </TableCell>
                                                <TableCell>
                                                    受信額 : {pointData?.point?.instructor}
                                                </TableCell>
                                            </TableRow>
                                            :
                                            <></>
                                        }
                                        {
                                            pointData?.instructor1?
                                            <TableRow>
                                                <TableCell>
                                                    ２親等紹介者
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        alignItems={'center'}
                                                        display={'flex'}
                                                    >
                                                        <Avatar className="avatar"
                                                            src={pointData?.instructor1?.avatar ? `${baseurl}/media/${pointData?.instructor1?.avatar}`:""}
                                                        >
                                                        </Avatar>
                                                        <Typography
                                                            color="textPrimary"
                                                            variant="body1"
                                                        >
                                                            {pointData?.instructor1?.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {pointData?.instructor1?.email}
                                                </TableCell>
                                                <TableCell>
                                                    受信額 : {pointData?.point?.instructor1}
                                                </TableCell>
                                            </TableRow>
                                            :
                                            <></>
                                        }
                                        <TableRow>
                                            <TableCell>
                                                手数料
                                            </TableCell>
                                            <TableCell>
                                                
                                            </TableCell>
                                            <TableCell>
                                                
                                            </TableCell>
                                            <TableCell>
                                                手数料 : {pointData?.point?.fee}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
            <Dialog
                className="spin-modal"
                open={this.state.spin}      
                disableBackdropClick
            >
                <CircularProgress />
            </Dialog>
        </Page>    
        );
    }
};
export default PointDetail;