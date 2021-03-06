
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
  title:"Registered Users List",
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
  title:"登録ユーザー一覧",
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

class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language:JSON.parse(localStorage.language).language,
      filter: {
        Keywords: "",
        PageSize: 10,
        PageNumber: 1,
      },
      pageCount:0,
      totalRecords:0,
      userdata:[],
      SelectedUserids:[],
      initSelectedArray:true,
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
      addPointModal: false,
      reducePointModal: false,
      totalPoint: '',
      point: '',
    };
  }

  handleSelectAll = (event) => {   
    const {userdata,SelectedUserids,filter}=this.state;
    var pageNumber = filter.PageNumber-1;
    let newselectedWorksIds=[];
    if (event.target.checked) {
      newselectedWorksIds = userdata.map((work) => work.id);
    } else {
      newselectedWorksIds = [];
    }
    SelectedUserids[pageNumber] = newselectedWorksIds
    this.setState({
      SelectedUserids:SelectedUserids
    });
  };

  handleSelectOne = (event, id) =>{
    const {SelectedUserids,filter}=this.state;
    var pageNumber = filter.PageNumber - 1;
    const selectedIndex = SelectedUserids[pageNumber].indexOf(id);
    let newselecteduserIds = [];
    if (selectedIndex === -1) {
      newselecteduserIds = newselecteduserIds.concat(SelectedUserids[pageNumber], id);
    } else if (selectedIndex === 0) {
      newselecteduserIds = newselecteduserIds.concat(SelectedUserids[pageNumber].slice(1));
    } else if (selectedIndex === SelectedUserids[pageNumber].length - 1) {
      newselecteduserIds = newselecteduserIds.concat(SelectedUserids[pageNumber].slice(0, -1));
    } else if (selectedIndex > 0) {
      newselecteduserIds = newselecteduserIds.concat(
        SelectedUserids[pageNumber].slice(0, selectedIndex),
        SelectedUserids[pageNumber].slice(selectedIndex + 1)
      );
    }
    SelectedUserids[pageNumber] = newselecteduserIds;
    this.setState({
      SelectedUserids:SelectedUserids
    });
  };

  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state;
    filter.PageNumber = PageNumber;
    this.setState({
        filter:filter
    });
    this.getuserData(filter);
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
        initSelectedArray:true
    });
    this.getuserData(filter);
  }


  handleCloseAlertModal =(event)=>{
    this.setState({
        Alertmodal:false
      });
  }


  handleFilterChange = dataFiledName => event=>{
    this.setState({
      [dataFiledName]: event.target.value
    });
  }

  handleKeyword = (event)=>{
    const {filter} = this.state;
    filter.Keywords = event.target.value;
    this.setState({filter:filter});
  }


  searchbyKeywords = (event) =>{
    event.preventDefault();
    var {filter} = this.state;
    this.setState({
      initSelectedArray:true,
    }) 
    this.getuserData(filter);
  }

  searchbyKeywordsclick = (event) =>{
    var {filter} = this.state;
    this.setState({
      initSelectedArray:true,
    }) 
    this.getuserData(filter);
  }

  componentDidMount(){

    const {filter} = this.state;
    this.getuserData(filter);

  } 
 
  getuserData(filter){
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
      var pageCount, totalRecords;
      var config = {
        method: 'post',
        url: `${baseurl}/api/getusers`,
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
        var responsedata = response.data.users;
        pageCount = response.data.pageCount;
        if(this.state.initSelectedArray)
        {
          var SelectedUserids = new Array();
          for(var i=0; i<=pageCount; i++)
          {
            var temp= new Array();
            SelectedUserids.push(temp);
          }
          this.setState({
            SelectedUserids:SelectedUserids,
            initSelectedArray:false
          });
        }
        totalRecords = response.data.totalRecord;
        this.setState({
          pageCount: pageCount,
          totalRecords:totalRecords,
          userdata:responsedata,
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
          userdata:[],
          spin:false
        });
    }); 
  }

  emailModalOpen = pk => {
    this.setState({
      userid: pk,
      emailModal: true
    })
  }

  changeEmail = e => {
    e.preventDefault()
    const {newEmail, newEmailConfirm, userid} = this.state
    if (newEmail == '') return
    if (newEmailConfirm == '') return
    if (newEmail !=newEmailConfirm) return
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data = JSON.stringify({'email': newEmail, 'id': userid})
    var config = {
      method: 'post',
      url: `${baseurl}/api/admin/changeuseremail`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : data,
    }
    axios(config)
    .then((response)=>{
      this.setState({emailModal: false, newEmail: '', newEmailConfirm: ''})
      this.getuserData(this.state.filter)
    })
    .catch((error)=>{
      if (error.response) {
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        else {
          this.setState({
            error: '他のユーザーが既にそのメールアドレスを使用しています。',
          })
        }
      }
    })
  }

  passwordModalOpen = pk => {
    this.setState({
      userid: pk,
      passwordModal: true
    })
  }

  changePassword = e => {
    e.preventDefault()
    const {userid} = this.state
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data = JSON.stringify({'id': userid})
    var config = {
      method: 'post',
      url: `${baseurl}/api/admin/changeuserpassword`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : data,
    }
    axios(config)
    .then((response)=>{
      this.setState({passwordModal: false})
    })
    .catch((error)=>{
      if (error.response) {
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
      }
    })
  }


  deleteModalOpen = pk => {
    this.setState({
      userid: pk,
      deleteModal: true
    })
  }

  deleteUser = e=> {
    e.preventDefault()
    const {userid} = this.state
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data = JSON.stringify({'id': userid})
    var config = {
      method: 'post',
      url: `${baseurl}/api/admin/deleteuser`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : data,
    }
    axios(config)
    .then((response)=>{
      this.setState({deleteModal: false})
      this.getuserData(this.state.filter)
    })
    .catch((error)=>{
      if (error.response) {
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
      }
    })
  }

  

  addPointModalOpen = pk => {
    this.setState({
      userid: pk,
      totalPoint: this.state.userdata.filter(user=>(user.pk == pk))[0]?.point? this.state.userdata.filter(user=>(user.pk == pk))[0]?.point.toString(): '0',
      addPointModal: true
    })
  }

  reducePointModalOpen = pk => {
    this.setState({
      userid: pk,
      totalPoint: this.state.userdata.filter(user=>(user.pk == pk))[0]?.point? this.state.userdata.filter(user=>(user.pk == pk))[0]?.point.toString(): '0',
      reducePointModal: true
    })
  }

  addPoint = e => {
    e.preventDefault()
    const {userid, point} = this.state
    if (point == '') {
      this.setState({
        error: '追加するポイントを入力します。',
      })
      return;
    }
    var point1 = parseFloat(point.replace(/,/g, ''))
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data = JSON.stringify({'id': userid, 'point': point1})
    var config = {
      method: 'post',
      url: `${baseurl}/api/admin/addpoint`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : data,
    }
    axios(config)
    .then((response)=>{
      this.setState({addPointModal: false, totalPoint: '', point: '', error: '',})
      this.getuserData(this.state.filter)
    })
    .catch((error)=>{
      if (error.response) {
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
      }
    })
  }

  reducePoint = e => {
    e.preventDefault()
    const {userid, point} = this.state
    console.log(userid, point)
    if (point == '') {
      this.setState({
        error: '消費するポイントを入力します。',
      })
      return;
    }
    var point1 = parseFloat(point.replace(/,/g, ''))
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data = JSON.stringify({'id': userid, 'point': point1})
    var config = {
      method: 'post',
      url: `${baseurl}/api/admin/reducepoint`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : data,
    }
    axios(config)
    .then((response)=>{
      this.setState({reducePointModal: false, totalPoint: '', point: '', error: '',})
      this.getuserData(this.state.filter)
    })
    .catch((error)=>{
      if (error.response) {
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
      }
    })
  }

  handlChangePoint =  e =>{
    this.setState({
        point: (e.target.value.replace(/,/g, "")).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    });
    if (this.state.reducePointModal) {
      if (parseInt(e.target.value.replace(/,/g, "")) > parseInt(this.state.totalPoint)) {
        this.setState({
          point: this.state.totalPoint.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      });
      }
    }
  }

  render() {
    const {
      userdata,
      totalRecords,
      SelectedUserids,
      language,
      pageCount,
      alertContent,
      alertTitle,
      Alertmodal,
      emailModal,
      userid,
      newEmail,
      newEmailConfirm,
      error,
      passwordModal,
      deleteModal,
      addPointModal,
      reducePointModal,
      totalPoint,
      point
    } = this.state;
   let pageSize = this.state.filter.PageSize;
   let PageNumber = this.state.filter.PageNumber;
   var Selectedids = SelectedUserids[PageNumber-1] ? SelectedUserids[PageNumber-1] : [];
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
                    <Box 
                      className="search-toolbar"
                    >                   
                      <form className="search-form" onSubmit={this.searchbyKeywords}>
                        <Box className="search-box" alignItems="center">
                          <TextField
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SvgIcon
                                    fontSize="small"
                                    color="action"
                                  >
                                    <SearchIcon />
                                  </SvgIcon>
                                </InputAdornment>
                              )
                            }}
                            placeholder={eval(language).searchPlaceholder}
                            variant="outlined"
                            onChange={this.handleKeyword}
                            value={this.state.filter.Keywords}
                          />
                          <Button className="search-button" onClick={this.searchbyKeywordsclick}> {eval(language).search} </Button>
                        </Box>
                      </form>
                    </Box>
                    <div className="searchresult">{eval(language).searchresult}:&nbsp;&nbsp;{totalRecords}</div>
                    {totalRecords==0 ? "":
                    <PerfectScrollbar>
                      <Box minWidth={1050} >
                        <Table className="result_table">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={Selectedids.length === userdata.length && userdata.length!==0}
                                  color="primary"
                                  indeterminate={
                                    Selectedids.length > 0
                                    && Selectedids.length < userdata.length
                                  }
                                  onChange={this.handleSelectAll}
                                />
                              </TableCell>
                              <TableCell>
                              {eval(language).userName}
                              </TableCell>
                              <TableCell>
                              {eval(language).userNamekana}
                              </TableCell>
                              <TableCell>
                              {eval(language).email}
                              </TableCell>
                              <TableCell>
                              {eval(language).point}
                              </TableCell>
                              <TableCell>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userdata.map((user) => (
                              <TableRow
                                hover
                                key={user.pk}
                                selected={Selectedids.indexOf(user.pk) !== -1}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={Selectedids.indexOf(user.pk) !== -1}
                                    onChange={(event) => this.handleSelectOne(event, user.pk)}
                                    value="true"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box
                                    alignItems="center"
                                    display="flex"
                                  >
                                    <Avatar className="avatar"
                                      src={user.avatar ? `${baseurl}/media/${user.avatar}`:""}
                                    >
                                    </Avatar>
                                    <Typography
                                      color="textPrimary"
                                      variant="body1"
                                    >
                                      {user.name1 + user.name2}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                {user.kana1 + user.kana2}
                                </TableCell>
                                <TableCell>
                                {user.email}
                                </TableCell>
                                <TableCell>
                                {user.point}
                                </TableCell>
                                <TableCell
                                  style={{width: '680px'}}
                                >
                                  <Button
                                    className="btn btn-detail"
                                    onClick={e=>{window.location.assign(`user/detail/${user.pk}`)}}
                                  >
                                   {eval(language).detail}
                                  </Button>
                                  <Button
                                    className='btn btn-primary'
                                    onClick={()=>this.addPointModalOpen(user.pk)}
                                  >
                                    ポイント追加
                                  </Button>
                                  <Button
                                    className='btn btn-delete'
                                    onClick={()=>this.reducePointModalOpen(user.pk)}
                                  >
                                    ポイント消費
                                  </Button>
                                  <Button
                                    className='btn btn-primary'
                                    onClick={()=>this.emailModalOpen(user.pk)}
                                  >
                                    メールア変更
                                  </Button>
                                  <Button
                                    className='btn btn-primary'
                                    onClick={()=>this.passwordModalOpen(user.pk)}
                                  >
                                    パスワード変更
                                  </Button>
                                  <Button
                                    className='btn btn-delete'
                                    onClick={()=>this.deleteModalOpen(user.pk)}
                                  >
                                    削除
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
                                  <option value={5}>5</option>
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
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
            open={emailModal}
            onClose={(e)=>(this.setState({emailModal: false, newEmail: '', newEmailConfirm: '', error: ''}))}
          >
            <div className='modal-body' onClick={(e)=>e.stopPropagation()}>
              <div className='modal-email'>
                <h2>メール変更</h2>
                <div className='modal-email-main'>
                  <div className='modal-img'>
                    <img src={userdata.filter(user=>(user.pk == userid))[0]?.avatar?`${baseurl}/media/${userdata.filter(user=>(user.pk == userid))[0]?.avatar}`:"/assets/image/avatar.svg"} />
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <label>ユーザー名</label>
                        </TableCell>
                        <TableCell>
                          {userdata.filter(user=>(user.pk==userid))[0]?.name1 + userdata.filter(user=>(user.pk==userid))[0]?.name2}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <label>新しいメール</label>
                        </TableCell>
                        <TableCell>
                          <input type="email" value={newEmail} onChange={(e)=>this.setState({newEmail: e.target.value, error: ''})} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <label>新しいメール確認</label>
                        </TableCell>
                        <TableCell>
                          <input type="email" value={newEmailConfirm} onChange={(e)=>this.setState({newEmailConfirm: e.target.value, error: ''})} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <p className='modal-error'>{error}</p>
              <div className='modal-link'>
                <button onClick={this.changeEmail}>メール変更</button>
                <button onClick={()=>(this.setState({emailModal: false, newEmail: '', newEmailConfirm: '', error: ''}))}>取消</button>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={passwordModal}
            onClose={(e)=>(this.setState({passwordModal: false, error: ''}))}
          >
            <div className='modal-body' onClick={(e)=>e.stopPropagation()}>
              <div className='modal-email'>
                <h2>パスワード変更</h2>
                <div className='modal-email-main'>
                  <div className='modal-img'>
                    <img src={userdata.filter(user=>(user.pk == userid))[0]?.avatar?`${baseurl}/media/${userdata.filter(user=>(user.pk == userid))[0]?.avatar}`:"/assets/image/avatar.svg"} />
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <label>ユーザー名</label>
                        </TableCell>
                        <TableCell>
                          {userdata.filter(user=>(user.pk==userid))[0]?.name1 + userdata.filter(user=>(user.pk==userid))[0]?.name2}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <h3>このユーザーのパスワードを本当に変更しますか？</h3>
              <p className='modal-error'>{error}</p>
              <div className='modal-link'>
                <button onClick={this.changePassword}>パスワード変更</button>
                <button onClick={()=>(this.setState({passwordModal: false,  error: ''}))}>取消</button>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={deleteModal}
            onClose={(e)=>(this.setState({deleteModal: false, error: ''}))}
          >
            <div className='modal-body' onClick={(e)=>e.stopPropagation()}>
              <div className='modal-email'>
                <h2>ユーザー削除</h2>
                <div className='modal-email-main'>
                  <div className='modal-img'>
                    <img src={userdata.filter(user=>(user.pk == userid))[0]?.avatar?`${baseurl}/media/${userdata.filter(user=>(user.pk == userid))[0]?.avatar}`:"/assets/image/avatar.svg"} />
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <label>ユーザー名</label>
                        </TableCell>
                        <TableCell>
                          {userdata.filter(user=>(user.pk==userid))[0]?.name1 + userdata.filter(user=>(user.pk==userid))[0]?.name2}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <h3>このユーザーを本当に削除してもよろしいですか？</h3>
              <p className='modal-error'>{error}</p>
              <div className='modal-link'>
                <button onClick={this.deleteUser}>ユーザー削除</button>
                <button onClick={()=>(this.setState({deleteModal: false,  error: ''}))}>取消</button>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={addPointModal}
            onClose= {(e)=>(this.setState({addPointModal: false, totalPoint: '', point: '', error: '',}))}
          >
            <div className='modal-body' onClick={(e)=>e.stopPropagation()}>
              <div className='modal-email'>
              <h2>ポイント追加</h2>
                <div className='modal-email-main'>
                  <div className='modal-img'>
                    <img src={userdata.filter(user=>(user.pk == userid))[0]?.avatar?`${baseurl}/media/${userdata.filter(user=>(user.pk == userid))[0]?.avatar}`:"/assets/image/avatar.svg"} />
                  </div>
                  <h3>現在の保有ポイント : {totalPoint}</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <label>ユーザー名</label>
                        </TableCell>
                        <TableCell>
                          {userdata.filter(user=>(user.pk==userid))[0]?.name1 + userdata.filter(user=>(user.pk==userid))[0]?.name2}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <label>ポイント</label>
                        </TableCell>
                        <TableCell>
                          <input type="text" value={point == 'NaN'? '': point} onChange={this.handlChangePoint} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <p className='modal-error'>{error}</p>
              <div className='modal-link'>
                <button onClick={this.addPoint}>ポイント追加</button>
                <button onClick={()=>(this.setState({addPointModal: false,  error: '', totalPoint: '', point: '',}))}>取消</button>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={reducePointModal}
            onClose= {(e)=>(this.setState({reducePointModal: false, totalPoint: '', point: '', error: '',}))}
          >
            <div className='modal-body' onClick={(e)=>e.stopPropagation()}>
              <div className='modal-email'>
              <h2>ポイント消費</h2>
                <div className='modal-email-main'>
                  <div className='modal-img'>
                    <img src={userdata.filter(user=>(user.pk == userid))[0]?.avatar?`${baseurl}/media/${userdata.filter(user=>(user.pk == userid))[0]?.avatar}`:"/assets/image/avatar.svg"} />
                  </div>
                  <h3>現在の保有ポイント : {totalPoint}</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <label>ユーザー名</label>
                        </TableCell>
                        <TableCell>
                          {userdata.filter(user=>(user.pk==userid))[0]?.name1 + userdata.filter(user=>(user.pk==userid))[0]?.name2}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <label>ポイント</label>
                        </TableCell>
                        <TableCell>
                          <input type="text" value={point == 'NaN'? '': point} onChange={this.handlChangePoint} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <p className='modal-error'>{error}</p>
              <div className='modal-link'>
                <button onClick={this.reducePoint}>ポイント消費</button>
                <button onClick={()=>(this.setState({reducePointModal: false,  error: '', totalPoint: '', point: '',}))}>取消</button>
              </div>
            </div>
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
export default UserView;