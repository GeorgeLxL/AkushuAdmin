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
const en = {
  UserDetail:"User Detail",
  userid:"User ID",
  name:"Name",
  name_furigana:"Furigana Name",
  maiden_name:"Maiden name",
  gender:"Gender",
  female:"Female",
  male:"Male",
  phone_number:"Phone Number",
  email:"Email",
  birthday:"Birthday",
  avatar:"Avatar",
  address:"Address",
  prefectures:"Prefectures",
  municipalities:"Municipalities",
  street_number:"Street Number",
  building_number:"Building name, room number, etc.",
  course:"Course",
  payment_method:"Payment method",
  bank_account:"Account information",
  bank_name:"Financial institution name",
  branch_name:"Branch name",
  deposit_type:"Deposit type",
  account_number:"Account Number",
  account_holder:"Account holder",
  referral_code:"Referral code",
}

const jp ={
  UserDetail:"ユーザーの詳細",
  userid:"ユーザーID",
  name:"お名前",
  name_furigana:"お名前 ふりがな",
  maiden_name:"旧姓",
  gender:"性別",
  female:"女性",
  male:"男性",
  phone_number:"電話番号",
  email:"メールアドレス",
  birthday:"生年月日",
  avatar:"顔写真",
  address:"住所",
  prefectures:"都道府県",
  municipalities:"市区町村",
  street_number:"町名・番地",
  building_number:"建物名・部屋番号など",
  course:"コース",
  payment_method:"支払い方法",
  bank_account:"口座情報",
  bank_name:"金融機関名",
  branch_name:"支店名",
  deposit_type:"預金種別",
  account_number:"口座番号",
  account_holder:"口座名義",
  referral_code:"紹介コード"
}

const sex=["男","女"];


function a11yProps(index) {
  return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

class UserDetail extends Component {

    state = {
        language:JSON.parse(localStorage.language).language,
        userid:"",
        userdata:{},
        instructor: {},
        instructor1: {},
        invited: [],
        invited1: [],
        spin:false,
        value:0,
        pointhistory:[],
        messages:[],
        message:"",
        avatar: '',
        notifications: [],
        createNotofication:false,
        notificaion_user: 1,
        notification_content: '',
        prequestion: false,
        business: false,
        realEstate: false,
        unoccupied: false,
        financial: false,
        prequestion_content: '',
    }; 
 
  handleGoback = (event) =>{
    window.history.back();
  }


  componentDidMount(){
     var path = window.location.href;
     var tokens = path.split("/");
     var id = tokens[tokens.length-1];
     this.setState({userid:id});
     this.getUserdetailData(id);
  }

  getUserdetailData(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    this.setState({spin:true});
    var config = {
      method: 'get',
      url: `${baseurl}/api/user/${id}`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
        data : {},
    };  
    axios(config)
    .then((response) => {
      var userdata = JSON.parse(response.data.user)[0];
      this.setState({
        userdata:userdata.fields,
        instructor: response.data.instructor == null? {}: response.data.instructor,
        instructor1: response.data.instructor1 == null? {}: response.data.instructor1,
        invited: JSON.parse(response.data.invited),
        invited1: response.data.invited1,
        spin:false
      });
      this.getUserPointHistory(id);
    })
    .catch((error)=> {
      this.setState({spin:false})
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
    });
  }

  getUserPointHistory(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
      method: 'get',
      url: `${baseurl}/api/point/history/${id}`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
        data : {},
    };
    axios(config)
    .then((response) => {
      var pointhistory = JSON.parse(response.data.pointhistory);
      this.setState({
        pointhistory:pointhistory
      });
    })
    .catch((error)=> {
      this.setState({spin:false})
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
    });
  }

  handleChange = (event,newValue)=>{
    clearInterval(this.interval);
    this.setState({
        value: newValue,
    })
    if(newValue==2)
    {
      this.getMessages();
    }
    if (newValue==3) {
      this.getNotification();
    }
    if (newValue==4) {
      this.getPreQuestion();
    }
  }

  handleChangeMessage = filedName => e=>{
    this.setState({
        [filedName]:e.target.value
    })
  }

  getMessages(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    var config = {
        method: 'get',
        url: `${baseurl}/api/getmessages/${this.state.userid}`,
        headers: { 
        'Authorization': 'Bearer ' + token,
        },
            data : {},
    };
    axios(config)
    .then((response) => {
        this.setState({
            messages:response.data.messages,
            avatar: response.data.avatar
        });
    })
    .catch((error)=>{
        this.setState({
            loading:false
        })
        if (error.response) {
            if(error.response.status===401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        }
    })

    this.interval = setInterval(() => {
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token
      var config = {
          method: 'get',
          url: `${baseurl}/api/getmessages/${this.state.userid}`,
          headers: { 
          'Authorization': 'Bearer ' + token,
          },
              data : {},
      };
      axios(config)
      .then((response) => {
          this.setState({
              messages: response.data.messages,
              avatar: response.data.avatar
          });
      })
      .catch((error)=>{
          this.setState({
              loading:false
          })
          if (error.response) {
              if(error.response.status===401){
                  localStorage.removeItem("userData");
                  window.location.assign('/');
              }
          }
      })
    },5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }


  handleSubmit = e =>{
    e.preventDefault();
    const {message} = this.state;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    if(message==""){
        return
    }
    var fd = new FormData();
    fd.append("message", message)
    fd.append("user", this.state.userid)
    fd.append("photo", null)
    var config = {
      method: 'post',
      url: `${baseurl}/api/sendmessage`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : fd
    };
    axios(config)
    .then((response)=>{
        this.setState({message:""});
        this.getMessages();
    })
    .catch((error)=>{
        if(error.response.status===401){
            localStorage.removeItem("userData");
            window.location.assign('/');
        }
    });
  }

  sendPhotoMessage = e => {
    var photo = e.target.files[0];
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    var fd = new FormData()
    fd.append('message', '')
    fd.append('photo', photo)
    fd.append('user', this.state.userid)
    var config = {
        method: 'post',
        url: `${baseurl}/api/sendmessage`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        data: fd
    };
    axios(config)
    .then((response)=>{
        this.setState({message: ""});
        this.getMessages();
    })
    .catch((error)=>{
        if(error.response.status===401){
            localStorage.removeItem("userData");
            window.location.assign('/');
        }
    });
  }

  getNotification(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    var data = JSON.stringify({id: this.state.userid})
    var config = {
        method: 'post',
        url: `${baseurl}/api/getnotifications`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        data : data,
    };
    axios(config)
    .then((response) => {
        this.setState({
            notifications:JSON.parse(response.data.notifications),
        });

    })
    .catch((error)=>{
        if (error.response) {
            if(error.response.status===401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        }
    })
  }

  notificationUserSelect(e) {
    if (e.target.checked) this.setState({notificaion_user: parseInt(e.target.value)})
  }

  postNotification = e => {
    e.preventDefault();
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    const {notification_content, notificaion_user, userid} = this.state
    if (notification_content == ""){
      return
    }
    var data
    if (notificaion_user == 1) data = JSON.stringify({"content": notification_content, "user": userid, "all": false})
    else data = JSON.stringify({"content": notification_content, "all": true})
    var config = {
      method: 'post',
      url: `${baseurl}/api/postnotification`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : data,
    };
    axios(config)
    .then((res)=>{
      this.setState({notification_content: "", createNotofication: false});
        this.getNotification();
    })
    .catch((error)=>{
      if(error.response.status===401){
        localStorage.removeItem("userData");
        window.location.assign('/');
      }
    })
  }

  getPreQuestion() {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    var data = JSON.stringify({id: this.state.userid})
    var config = {
        method: 'post',
        url: `${baseurl}/api/getprequestion`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        data : data,
    };
    axios(config)
    .then((response) => {
      if (response.data.prequestion) {
        var prequestion_main = JSON.parse(response.data.prequestion)[0]
        this.setState({
          prequestion: true,
          business: prequestion_main.fields.business,
          realEstate: prequestion_main.fields.realEstate,
          unoccupied: prequestion_main.fields.unoccupied,
          financial: prequestion_main.fields.financial,
          prequestion_content: prequestion_main.fields.content
        })
      }
      else {
        this.setState({
          prequestion: false
        })
      }
    })
    .catch((error)=>{
        if (error.response) {
            if(error.response.status===401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        }
    })
  }

  render() {
    const {userdata,
      instructor,
      instructor1,
      invited,
      invited1,
      language,
      userid,
      value,
      pointhistory,
      messages,
      avatar,
      notifications,
      notification_content,
      prequestion,
      business,
      realEstate,
      unoccupied,
      financial,
      prequestion_content
    } = this.state;
    console.log(invited, invited1, pointhistory)
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
                    <a className="before-page" onClick={this.handleGoback} href="#">◀ {eval(language).back}</a>
                    <span>{eval(language).UserDetail} </span>
                </div>
            </Box>
            <Box mt={3}>
                <Card>
                  <CardContent className="tab-Card">
                     <AppBar className="tab-Header" position="static">
                        <Tabs value={value} onChange={this.handleChange} aria-label="">
                            <Tab style={{color:"black", fontSize:"18px", fontWeight:"600"}} label="ユーザー" {...a11yProps(0)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="ポイント履歴" {...a11yProps(1)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="メッセージ履歴" {...a11yProps(2)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="通知履歴" {...a11yProps(3)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="アンケート" {...a11yProps(4)} />
                            アンケート
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                      <Box minWidth={1050} >
                          <Table className="artdetail_table">
                          <TableBody>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).userid}
                                  </TableCell>
                                  {userdata.id}
                                  <TableCell colSpan="4">
                                  {userid}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).name}
                                  </TableCell>
                                  <TableCell>
                                    {`${userdata.name1?userdata.name1:""} ${userdata.name2?userdata.name2:""}`}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).name_furigana}
                                    <br/>
                                  </TableCell>
                                  <TableCell  colSpan="3">
                                    {`${userdata.kana1?userdata.kana1:""} ${userdata.kana2?userdata.kana2:""}`}
                                    <br/> 
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).maiden_name}
                                  </TableCell>
                                  <TableCell  colSpan="4">
                                    {userdata.maidenname}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).gender}
                                  </TableCell>
                                  <TableCell  colSpan="4">
                                  {sex[userdata.gender]}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).email}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  {userdata.email}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).address}
                                  </TableCell>
                                  <TableCell className="filedname"> 
                                    {eval(language).prefectures}
                                    <br/>
                                    {eval(language).municipalities}
                                    <br/>
                                    {eval(language).street_number}
                                    <br/>
                                    {eval(language).building_number}
                                  
                                  </TableCell>
                                  <TableCell colSpan="3">
                                    {userdata.address1} 
                                    <br/>
                                    {userdata.address2}  
                                    <br/>
                                    {userdata.street}
                                    <br/>
                                    {userdata.buildingName}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).phone_number}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  {userdata.phone}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).birthday}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  {userdata.birthday}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).avatar}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  <Avatar
                                    className="certificate_image"
                                    src={userdata.avatar ? `${baseurl}/media/${userdata.avatar}`:""}
                                  >
                                  </Avatar>
                                  </TableCell>
                              </TableRow>
                              {/* <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).bank_account}
                                  </TableCell>
                                  <TableCell className="filedname"> 
                                    {eval(language).bank_name}
                                    <br/>
                                    {eval(language).branch_name}
                                    <br/>
                                    {eval(language).deposit_type}
                                    <br/>
                                    {eval(language).account_number}
                                    <br/>
                                    {eval(language).account_holder}
                                  </TableCell>                                
                                  <TableCell>
                                  {userdata.bankName}
                                  <br/>
                                  {userdata.branchName}
                                  <br/>
                                  {userdata.depositType}
                                  <br/>
                                  {userdata.accountNumber}
                                  <br/>
                                  {userdata.accountName}
                                  </TableCell>
                              </TableRow> */}
                              <TableRow>
                                <TableCell className='filedname'>
                                  １親等紹介者
                                </TableCell>
                                {
                                  instructor.email?
                                  <>
                                    <TableCell>
                                      <Box
                                        alignItems="center"
                                        display="flex"
                                      >
                                        <Avatar className="avatar"
                                          src={instructor.avatar ? `${baseurl}/media/${instructor.avatar}`:""}
                                        >
                                        </Avatar>
                                        <Typography
                                          color="textPrimary"
                                          variant="body1"
                                        >
                                          {instructor.name}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell colSpan="3">
                                      {instructor.email}
                                    </TableCell>
                                  </>
                                  :
                                  <TableCell colSpan="4">１親等紹介者はいません。</TableCell>
                                }
                              </TableRow>
                              {
                                instructor.email?
                                <TableRow>
                                  <TableCell className='filedname'>
                                    ２親等紹介者
                                  </TableCell>
                                  {
                                    instructor1.email?
                                    <>
                                      <TableCell>
                                        <Box
                                          alignItems="center"
                                          display="flex"
                                        >
                                          <Avatar className="avatar"
                                            src={instructor1.avatar ? `${baseurl}/media/${instructor1.avatar}`:""}
                                          >
                                          </Avatar>
                                          <Typography
                                            color="textPrimary"
                                            variant="body1"
                                          >
                                            {instructor1.name}
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                      <TableCell colSpan="3">
                                        {instructor1.email}
                                      </TableCell>
                                    </>
                                    :
                                    <TableCell colSpan="4">２親等紹介者はいません。</TableCell>
                                  }
                                </TableRow>
                                :
                                <></>
                              }
                              <TableRow>
                                <TableCell className='filedname'>紹介した人（１親等）</TableCell>
                                <TableCell colSpan="4" className="invited">
                                  {
                                    invited.length>0?
                                    <>
                                    {
                                      invited.map(i=>(
                                        <p key={i.pk}>{i.fields.name1 + i.fields.name2}</p>
                                      ))
                                    }
                                    </>
                                    :
                                    <>紹介した人はいません。</>
                                  }
                                </TableCell>
                              </TableRow>
                              {
                                invited.length>0?
                                <TableRow>
                                  <TableCell className='filedname'>紹介した人（２親等）</TableCell>
                                  <TableCell colSpan="4" className="invited">
                                  {
                                    invited1.length>0?
                                    <>
                                    {
                                      invited1.map(i=>(
                                        <p key={i.pk}>{i.name1 + i.name2}</p>
                                      ))
                                    }
                                    </>
                                    :
                                    <>紹介した人はいません。</>
                                  }
                                </TableCell>
                                </TableRow>
                                :
                                <></>
                              }
                          </TableBody>
                          </Table>
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <Table className="result_table">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  コンテンツ
                                </TableCell>
                                <TableCell>
                                  年月日
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pointhistory.map((history) => (
                                <TableRow
                                  hover
                                  key={history.pk}
                                >
                                  <TableCell>
                                    {history.fields.content}
                                  </TableCell>
                                  <TableCell>
                                    {(new Date(history.fields.created_at)).getFullYear().toString() + '年' + ((new Date(history.fields.created_at)).getMonth()+1).toString() + '月' + (new Date(history.fields.created_at)).getDate().toString() + '日'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <div className="notification-container">
                          <div className="chat-card">
                              <div className="chat-card-content">
                                  <div className="chat-card-content1">
                                      {messages.map(item=>(
                                        <div key={item.pk} className={`${item.send ? "chat-outbox" : "chat-inbox"} ${item.first? "first":""}`}>
                                          
                                          {item.send ? "": item.first? <img src={avatar ? `${baseurl}/media/${avatar}`:"/assets/image/avatar.svg"} /> : ""}
                                          <div>
                                            {
                                              item.content != ''?
                                              <p>{item.content}</p>
                                              :
                                              <></>
                                            }
                                            {
                                              item.photo?
                                              <img src={`${baseurl}/media/${item.photo}`} />
                                              :
                                              <></>
                                            }
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                              </div>
                              <div className="chat-photo">
                                  <input type="file" onChange={this.sendPhotoMessage} ref={(ref) => this.upload = ref} hidden accept="image/*" />
                                  <button onClick={(e) => this.upload.click()} ><img src="/assets/image/top-foot-link4.png" /></button>
                              </div>
                              <form onSubmit={this.handleSubmit}>
                                  <div className="chat-input">
                                      <input type="text" onChange={this.handleChangeMessage("message")} value={this.state.message}/>
                                      <button onClick={this.handleSubmit}><img src="/assets/image/top-foot-link2.png" /></button>
                                  </div>
                              </form>
                          </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      <Table className="result_table">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              コンテンツ
                            </TableCell>
                            <TableCell>
                              年月日
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {notifications.map((history) => (
                            <TableRow
                              hover
                              key={history.pk}
                            >
                              <TableCell>
                                {history.fields.content}
                              </TableCell>
                              <TableCell>
                                {(new Date(history.fields.created_at)).getFullYear().toString() + '年' + ((new Date(history.fields.created_at)).getMonth()+1).toString() + '月' + (new Date(history.fields.created_at)).getDate().toString() + '日'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className='notification-add'>
                        <button onClick={()=>this.setState({createNotofication: true})}>通知投稿</button>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <div className='prequestion'>
                        {
                          prequestion?
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    ビジネスマッチングに興味はありますか？
                                  </TableCell>
                                  <TableCell>
                                    {business?'はい':'いいえ'}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    不動産情報に興味はありますか？
                                  </TableCell>
                                  <TableCell>
                                    {realEstate?'はい':'いいえ'}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    金融情報（投資案件）に興味はありますか？
                                  </TableCell>
                                  <TableCell>
                                    {unoccupied?'はい':'いいえ'}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    その他興味のあること
                                  </TableCell>
                                  <TableCell>
                                    {financial?'はい':'いいえ'}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    ビジネスマッチングに興味はありますか？
                                  </TableCell>
                                  <TableCell>
                                    <p dangerouslySetInnerHTML={{__html: prequestion_content.replace(/(?:\r\n|\r|\n)/g, '<br />')}}></p>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            :
                            <h3>このユーザーはまだアンケートに回答していません。</h3>
                        }
                      </div>
                    </TabPanel>
                  </CardContent>
                </Card>
            </Box>
        </Container>
        <Dialog
          className=""
          open={this.state.createNotofication}
          onClick={()=>this.setState({createNotofication: false})}
        >
          <div className='modal-body' onClick={(e)=>e.stopPropagation()}>
            <div className='modal-notification'>
              <h2>通知投稿</h2>
              <div className='modal-notification-user'>
                <div>
                  <input type="radio" value="1" name="user" id="notification_current" defaultChecked onClick={(e)=>this.notificationUserSelect(e)} />
                  <label htmlFor='notification_current'>現在ユーザー</label>
                </div>
                <div>
                  <input type="radio" value="2" name="user" id="notification_all" onClick={(e)=>this.notificationUserSelect(e)} />
                  <label htmlFor='notification_all'>すべてユーザー</label>
                </div>
              </div>
              <div className='modal-notification-content'>
                <textarea rows={5} value={notification_content} onChange={(e)=>this.setState({notification_content: e.target.value})}></textarea>
              </div>
            </div>
            <div className='modal-link'>
              <button onClick={this.postNotification}>投稿</button>
              <button onClick={()=>this.setState({createNotofication: false})}>取消</button>
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
      </Page>    
    );
 }
};
export default UserDetail;