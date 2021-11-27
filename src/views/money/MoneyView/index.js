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
  ButtonGroup,
  Button,
  TextField,
  Checkbox,
  InputAdornment,
  Typography,
  IconButton,
  SvgIcon, 
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import CircularProgress from '@material-ui/core/CircularProgress';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
import Page from 'src/components/Page';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;

const interestList =[
    '保険',
    '貯蓄',
    '資産運用',
    '節税',
    '不動産活用',
    'ライフプラニング/家計の見直し',
    '老後資金',
    '投資信託',
    'IDECO/NISA',
    '教育資金',
    '不動産投資',
    '相続',
    '生前贈与',
    'リースバック',
    'リバースモーゲージ',
    '資金調達',
    '補助金/助成金'
]

const wantList = [
    'お金の勉強がしたい',
    '株の勉強がしたい',
    '暗号通貨の勉強がしたい',
    'FXの勉強がしたい',
    '補助金申請をお願いしたい',
    '住宅ローンの返済で困っている',
    '海外外貨稼ぎたい',
    'ポイント活用',
    '老後の資金を貯めたい',
    '保険を見直したい',
    '家計を見直したい',
    '教育資金を貯めたい',
    '土地を活用したい',
    '社会活動的な寄付をしたい',
    'サイドビジネスをやりたい',
    '販路拡大したい',
    '隙間時間の活用をしたい',
    '自社ビジネスを展開',
]

class MoneyView extends Component {

    state = {
        language:JSON.parse(localStorage.language).language,
        spin:false,
        value:0,
        List:[],
        pageCount1:0,
        totalRecords1:0,
        filter1: {
            Keywords: "",
            PageSize: 10,
            PageNumber: 1,
        },

    }; 
 
  handleGoback = (event) =>{
    window.history.back();
  }

  handleChange = (event,newValue)=>{
    this.setState({
        value:newValue,
    })
  }

  componentDidMount()
  {
      const {filter1} = this.state;
      this.getList(filter1);
  }

  getList(filter){
        var userData = JSON.parse(localStorage.userData);
        var token = userData.token;
        var pageCount, totalRecords;
        var config = {
        method: 'post',
        url: `${baseurl}/api/money/getlist`,
        headers: { 
            'Authorization': 'Bearer ' + token,
        },
        data : filter,
        };

        axios(config)
        .then((response) => {
            var responsedata = response.data.money;
            pageCount = response.data.pageCount;
            totalRecords = response.data.totalRecord;
            this.setState({
                pageCount1: pageCount,
                totalRecords1:totalRecords,
                List:responsedata,
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
                pageCount1: 0,
                totalRecords1:0,
                List:[]
            });
        });
  }

  handleKeyword1 = (event)=>{
    const {filter1} = this.state;
    filter1.Keywords = event.target.value;
    this.setState({filter1:filter1});
  }


  searchbyKeywords1 = (event) =>{
    event.preventDefault();
    var {filter1} = this.state;
    this.getList(filter1);
  }

  searchbyKeywordsclick1 = (event) =>{
    var {filter1} = this.state;
    this.getList(filter1);
  }
  
  handlePagenation1 = (events,PageNumber)=>{
    const {filter1} = this.state;
    filter1.PageNumber = PageNumber;
    this.setState({
        filter1:filter1
    });
    this.getList(filter1);
  }

  handlePagecount1 = (events)=>{
    const {filter1} = this.state;
    var prevepageSize = filter1.PageSize;
    var prevepageNumber = filter1.PageNumber;
    var currentPagesize = events.target.value;
    filter1.PageSize = currentPagesize; 
    filter1.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter1:filter1,
    });
    this.getList(filter1);
  }

 render() {
   const {value, filter1, pageCount1, totalRecords1, List,} = this.state;
   let pageSize1 = this.state.filter1.PageSize;
   let PageNumber1 = this.state.filter1.PageNumber;
    return(
      <Page
        className="root"
        title="Akushu|UserDetail"
      >
        <Container maxWidth={false}>
            
            <Box mt={3}>
                <Card>
                  <CardContent>
                      <Box minWidth={1050} paddingTop={4}>
                        <form className="search-form" onSubmit={this.searchbyKeywords1}>
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
                                    variant="outlined"
                                    onChange={this.handleKeyword1}
                                    value={this.state.filter1.Keywords}
                                />
                                <Button className="search-button" onClick={this.searchbyKeywordsclick1}> 検 索 </Button>
                            </Box>
                        </form>
                        {totalRecords1==0 ? "":
                            <PerfectScrollbar>
                            <Box minWidth={1050} >
                                <Table className="result_table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            氏名
                                        </TableCell>
                                        <TableCell>
                                            TEL
                                        </TableCell>
                                        <TableCell>
                                            メールアドレス
                                        </TableCell>
                                        <TableCell>
                                            興味のあるお金のセミナー
                                        </TableCell>
                                        <TableCell>
                                            どのようなことをしたいですか？
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {List.map((money) => (
                                    <TableRow
                                        hover
                                        key={money.pk}
                                    >
                                        <TableCell>
                                            {money.name1} {money.name2}
                                        </TableCell>
                                        <TableCell>
                                            {money.phone}
                                        </TableCell>
                                        <TableCell>
                                            {money.email}
                                        </TableCell>
                                        <TableCell>
                                            {interestList[money.interest]}
                                        </TableCell>
                                        <TableCell>
                                            {wantList[money.want]}
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
                                <label>表示する行数:
                                    <select className="pageCount" value={pageSize1} onChange={this.handlePagecount1}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </label>
                            </Box>
                            <Pagination count={pageCount1} page={PageNumber1} className="paginationitem"  onChange={this.handlePagenation1} variant="outlined" color="primary" />
                        </Box>
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
export default MoneyView;