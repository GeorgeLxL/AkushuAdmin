
import React, {Component} from 'react';

import {
  Avatar,
  Box,
  Container,
  ButtonGroup,
  Button,
  Card,
  CardContent,
  TextField,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  IconButton,
  Slide,
  SvgIcon,
  DialogTitle,
  DialogContent,
  DialogContentText,
  
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Search as SearchIcon } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Transitionalert = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const en={
  search:"Search",
  title:"Point Send/Recieve List",
  searchPlaceholder:"Search (User name, User Email)",
  userName:"User Name",
  userNamekana:"Kana Name",
  email:"Email",
  point:"Points",
  category:"Category",
  image:"Image",
  addfilter:"Add Filter",
  sort:"Sort",
  artWorkname:"Artwork Name",
  season:"Season",
  color:"Color",
  detail:"DETAIL",
  conditionStatus:"Condition Status",
  regDate:"Registered Date",
  applybutton:"APPLY",
  resetButton:"RESET",
  pageShow:"Show",
  ok:"O K",
  reflection:"REFLECTION",
  artistDataSyncTitle:"Synchronize artwork data",
  artistDatasyncContent:"Sync data has been called",
  status:"Artwork syncing",
  searchresult:"Search result",
  allrecord:"All record",
  error:"error", 
}

const jp={
  search:"検索",
  title:"ポイント送受信一覧",
  searchPlaceholder:"フリーワード検索（ユーザー名、メールアドレス）",
  userName:"ユーザー名",
  userNamekana:"ユーザー名",
  email:"メールアドレス",
  point:"ポイント",
  category:"カテゴリー",
  image:"イメージ",
  addfilter:"フィルターを追加",
  sort:"ソート",
  artWorkname:"作品名",
  season:"季節",
  color:"色合い",
  detail:"詳    細",
  conditionStatus:"状態（ステータス）",
  regDate:"登録日",
  applybutton:"適  用",
  resetButton:"リセット",
  pageShow:"表示する行数",
  ok:"確認",
  reflection:"即 反 映",
  artistDataSyncTitle:"作品データを同期",
  artistDatasyncContent:"同期データが呼び出されました。",
  status:"作品情報連携中",
  searchresult:"検索結果",
  allrecord:"全レコード",
  error:"失敗", 
}

class PointView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language:JSON.parse(localStorage.language).language,
      filter: {
        PageSize: 15,
        PageNumber: 1,
      },
      pageCount:0,
      totalRecords:0,
      pointHistory:[],
      Alertmodal:false,
      alertTitle:"",
      alertContent:"",
      spin:false,
      emailModal: false,
      userid: '',
      newEmail: '',
      newEmailConfirm: '',
      error: '',
      passwordModal: false,
      deleteModal: false,
    };
  }

  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state;
    filter.PageNumber = PageNumber;
    this.setState({
        filter:filter
    });
    this.getPointHistory(filter);
  }

  handlePagecount = (events)=>{
    const {filter} = this.state;
    var prevepageSize = filter.PageSize;
    var prevepageNumber = filter.PageNumber;
    var currentPagesize = events.target.value;
    filter.PageSize = currentPagesize; 
    filter.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter:filter,
    });
    this.getPointHistory(filter);
  }


  handleCloseAlertModal =(event)=>{
    this.setState({
        Alertmodal:false
      });
  }

  componentDidMount(){
    const {filter} = this.state;
    this.getPointHistory(filter);
  }
 
  getPointHistory(filter){
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
      var pageCount, totalRecords;
      var config = {
        method: 'post',
        url: `${baseurl}/api/admin/pointhistory`,
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        data : filter,
      };
      this.setState({
        spin:true
      });
      axios(config)
      .then((response) => {
        var responsedata = response.data.pointHistory;
        totalRecords = response.data.totalRecord;
        pageCount = response.data.pageCount
        this.setState({
          pageCount: pageCount,
          totalRecords:totalRecords,
          pointHistory:responsedata,
          spin:false
        });
      })
      .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        } 
        this.setState({
          pageCount: 0,
          totalRecords:0,
          pointHistory:[],
          spin:false
        });
    }); 
  }

  render() {
    const {
      pointHistory,
      totalRecords,
      language,
      pageCount,
      alertContent,
      alertTitle,
      Alertmodal,
      userid,
    } = this.state;
   let pageSize = this.state.filter.PageSize;
   let PageNumber = this.state.filter.PageNumber;
   console.log(userid)
   return(
      <Page
        className="root"
        title="Akushu|User"
      >
        <Container maxWidth={false}>
          <div className="tool-bar">
              <Box
                display="flex"
                justifyContent="space-between"
              >              
                <div className="page-title">                
                <span>{eval(language).title} </span>
                  {this.state.syncstatus ? <span className="statues">{eval(language).status}</span>:""}
                </div>
              </Box>
              <Box mt={3}>
                <Card>
                  <CardContent>
                    <div className="searchresult">{eval(language).searchresult}:&nbsp;&nbsp;{totalRecords}</div>
                    {totalRecords==0 ? "":
                    <PerfectScrollbar>
                      <Box minWidth={1050} >
                        <Table className="result_table">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                年月日
                              </TableCell>
                              <TableCell>
                                コンテンツ
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pointHistory.map((point) => (
                              <TableRow
                                hover
                                key={point.pk}
                              >
                                <TableCell>
                                  {(new Date(point.created_at)).getFullYear().toString() + '年' + ((new Date(point.created_at)).getMonth()+1).toString() + '月' + (new Date(point.created_at)).getDate().toString() + '日'}
                                </TableCell>
                                <TableCell>
                                  <p dangerouslySetInnerHTML={{__html: point.content.replace(/(?:\r\n|\r|\n)/g, '<br />')}}></p>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className="btn btn-detail"
                                    onClick={e=>{window.location.assign(`point/detail/${point.pk}`)}}
                                  >
                                    詳   細
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </PerfectScrollbar>
                    }
                    <Box className="pagination">
                      <Box className="pageCountarea">
                          <label>{eval(language).pageShow}:
                              <select className="pageCount" value={pageSize} onChange={this.handlePagecount}>
                                  <option value={15}>15</option>
                                  <option value={30}>30</option>
                                  <option value={50}>50</option>
                              </select>
                          </label>
                      </Box>
                      <Pagination count={pageCount} page={PageNumber} className="paginationitem"  onChange={this.handlePagenation} variant="outlined" color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
          </div>
          <Dialog
            className="alert-modal"
            open={Alertmodal}
            TransitionComponent={Transitionalert}
            keepMounted
            onClose={this.handleCloseAlertModal}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title" style={{textAlign:"center"}}>{alertTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {alertContent}
              </DialogContentText>
              <div className="search-btn">
                <Button onClick={this.handleCloseAlertModal} className="btn btn-search">
                  {eval(language).ok}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
        <Dialog
            className="spin-modal"
            open={this.state.spin}      
            disableBackdropClick
        >
            <CircularProgress />
        </Dialog>
      </Container>
    </Page>
    
    );
 }
};
export default PointView;