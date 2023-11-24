import React, { useEffect, useState } from 'react'
import { useParams ,useLocation,Link} from 'react-router-dom'
import { allDistrictList } from 'services/dashboardService';
import { useSelector ,useDispatch} from 'react-redux';
import {loader} from "redux/type";
import {Box,Breadcrumbs} from "@mui/material"
import { dashboard } from 'redux/type';
import DataTable from 'react-data-table-component';
import DeptVsDBTBenAnalytics from '../dashboard/charts/DeptVsDBTBenAnalytics';
import DeptVsDBTageWise from '../dashboard/charts/DeptVsDBTAgeWise';
import DeptVsDBTCommunity from '../dashboard/charts/DeptVsDBTCommunity';
import DeptVsDBTGenderDist from '../dashboard/charts/DeptVsDBTGenderDist';
import RangeWiseSchemeData from '../dashboard/charts/RangeWiseSchemeData';
const District=()=>{
 
    let [dbtTotal,setDbt]=useState(0);
    let [benTotal,setBen]=useState(0);
    let [deptTotal,setDept]=useState(0);
    const [data, setData] = useState([]);
    let rows=[];
  let columns=[
    // {
    //   name:"S.no",
    //   selector:row=>row.sno,
    //   width:'10%',
    //   center:true,
    //   sortable: false,
     
    // },
    {
      name: 'District',
      selector:row=>row.district,
      width:'15%',
      left:true,
      // Cell: ({ row }) => (
      //       <Link to="/scheme" >{row.department}</Link>)
     
    },
    {
      name:'Beneficiaries',
      selector:row=>row.benificary,
      sortable: true,
      right:'true',
      width:'13%'
    },
    {
      name: 'Amount Disbursed(Cr)',
      selector:row=>row.amount,
      sortable: true,
      right:'true',
      width:'20%'
    },
    {
      name:'Aadhaar Share Of Transactions(%)',
      selector:row=>row.transaction,
      sortable: true,
      right:'true'
    },
    {
      name:'Aadhaar Share Of DBT Amount(%)',
      selector:row=>row.dbtTransaction,
      sortable: true,
      right:'true'
    }
 
  ]
   
 
    const fyear = useSelector((state)=>state.dashboard.fy)
  const [fy, setFy] = useState(fyear);
  const setFinancialYear = (fy) => {
    setFy(fy);
    dispatch({ type: dashboard.fy, payload: fy });
  }
    const schemeId=useLocation().state.schemeId;
    const schemeName=useLocation().state.schemeName;
    const deptId=useLocation().state.deptId;
    const [districtList,setDistrictList]=useState([])
    const dispatch = useDispatch();
 
    useEffect(()=>{
        districtListApi();
        },[fy,schemeId]);
 
        const analyticData={
          from:'district',
          id:schemeId,
        };
        const rangeData={
          id:schemeId
        }
    function districtListApi(){
        dispatch({type: loader.startLoader});
        allDistrictList(fy,schemeId,(res)=>{
            if(res.status){
                let dbtTemp=0;
                let benTemp=0;
                let temp=[];
                temp=res.result;
                setDept(res.result.length)
                let i=0;
                temp.forEach(element => {
                    element.dbtValue=(Math.round(element.dbtValue*100)/100)
                    dbtTemp+=element.dbtValue;
                     benTemp+=element.benCount;
                     rows.push({'sno':i+1,'district':element.objectName,'benificary':element.benCount,'amount':element.dbtValue,'transaction':element.percentAadhaarTransaction,'dbtTransaction':element.percentAadhaarTransactionAmount})
                     i++;
                });
                setDistrictList(res.result);
                setBen(benTemp);
                setDbt(dbtTemp);
                console.log("hbjhbb",res.result)
                rows.push({'district':<b>Total</b>,'benificary':<b>{benTemp}</b>,'amount':<b>{Math.round(dbtTemp * 100) / 100}</b>})
                setData(rows)
            }
            dispatch({ type: loader.stopLoader });
        })
    }
    const customStyle={
      headCells:{
        style:{
          fontWeight:'bold',
         
        }
      },
    }
   
    return(
    <>
    <div className="welcome-info"><b>List of District's</b></div>
    <Box m={1}>
      <Breadcrumbs aria-label='breadcrumb' separator='|' >
      <Link to='/dashboard' underline='hover' style={{color:"cornflowerblue"}}>Dashboard</Link>
      <Link to='/department' underline='hover' style={{color:"cornflowerblue"}}>Department</Link>
      <Link to='/scheme' state={{deptId:deptId}} underline='hover' style={{color:"cornflowerblue"}}>Scheme</Link>
      </Breadcrumbs>
    </Box>
 
    <div className='select-bar'>
            <span>Financial Year</span>
            <div style={{ 'width': 260 }}>
              <select name="fincialYear" className='form-select financial-select' value={fy} onChange={(e) => setFinancialYear(e.target.value)}>
                <option value="-1">Select Financial Year</option>
                <option value="2018">2017-2018</option>
                <option value="2019">2018-2019</option>
                <option value="2020">2019-2020</option>
                <option value="2021">2020-2021</option>
                <option value="2022">2021-2022</option>
                <option value="2023">2022-2023</option>
                <option value="2024">2023-2024</option>
              </select>
 
            </div>
          </div>
    <div className="chart-box m-0" style={{'backgroundColor':'#F9FEFA'}}>
              {/* <h3 className="sub_heading"><b>District Insights</b></h3> */}
              <div className='card' style={{ background:'darkgreen',width:'100%',color:'white',marginTop:'-15px'}}><div style={{color:'white',fontSize:'20px'}}> {schemeName} <b>District Insights</b> For FY  {parseInt(fy)-1}-{fy}</div></div>
              <div className="row" style={{justifyContent:'space-around'}}>
              <div className="col-sm-3" style={{backgroundColor:'#E4FFD0'}}>
            <div className="card cardEffect">  
           
                <div className="card-head"  >
                     Districts
                </div>
                <div className="card-value" >
                    {deptTotal.toLocaleString("en-IN")}
                </div>
 
                <div className="card-icon">
                    <i className="fa fa-building"></i>
                </div>
            </div>
 
           
        </div>
        <div className="col-sm-3" style={{backgroundColor:'#E4FFD0'}}>
            <div className="card cardEffect">  
           
                <div className="card-head"  >
                     Beneficiaries
                </div>
                <div className="card-value" >
                    {benTotal.toLocaleString("en-IN")}
                </div>
 
                <div className="card-icon">
                    <i className="fa fa-user"></i>
                </div>
            </div>
 
           
        </div>
        <div className="col-sm-3" style={{backgroundColor:'#E4FFD0'}}>
            <div className="card cardEffect">  
           
                <div className="card-head"  >
                     Amount Disbursed
                </div>
                <div className="card-value" >
                    {dbtTotal.toLocaleString("en-IN")} Cr
                </div>
 
                <div className="card-icon">
                    <i className="fa fa-inr"></i>
                </div>
            </div>
 
           
        </div>
      </div>
      </div>
      <div className="row dbt-insight" style={{ marginTop: '-20px' }}>
 
<div className="col-sm-12 top-design">
  <div className="chart-box m-0" style={{ 'backgroundColor': '#F9FEFA' }}>
    <div className='card' style={{ background: 'darkgreen', width: '100%', color: 'white', marginTop: '-20px', height: '50px' }}><div style={{ color: 'white', fontSize: '19px', textAlign: 'center' }}> <b>UDDP Analytics</b>  For FY  {parseInt(fy) - 1}-{fy}</div></div>
    {/* <div className='card' style={{ background:'darkgreen',width:'100%',color:'white'}}><div style={{textAlign:'center'}} > <h3 ><b style={{color:'white',fontSize:'20px'}}>DBT Insights For FY  {fy}-{parseInt(fy)+1}</b></h3></div></div> */}
    {/* <h3 className="sub_heading"><b>DBT Insights For FY  {fy}-{parseInt(fy)+1}</b></h3> */}
    <div className="row">
 
    <DeptVsDBTBenAnalytics data={analyticData}/>
      <div className="row">
        <div className=" col-3">
 
          <DeptVsDBTageWise data={analyticData}/>
          {/* <SchemeWiseDbtDist /> */}
        </div>
        <div className=" col-3">
          <DeptVsDBTCommunity data={analyticData} />
 
          {/* <PerFamilyWiseDBT /> */}
        </div>
        <div className=" col-3">
          <DeptVsDBTGenderDist data={analyticData} />
        </div>
        <div className=" col-3">
          <RangeWiseSchemeData data={rangeData}/>
        </div>
      </div>
     
     
 
    </div>
  </div>
</div>
</div>
    <div className='card'>
 
    <DataTable
        columns={columns}
        data={data}
        striped={true}
        fixedHeader
        pagination
        dense
        customStyles={customStyle}
        />
    {/* <table class="table table-bordered table-hover">
      <thead >
        <tr>
          <th>S.no</th>
          <th>District</th>
          <th>No of Beneficiaries</th>
          <th>Amount Disbursed(cr)</th>
        </tr>
      </thead>
      <tbody>
      {districtList.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{key+1}</td>
                            <td style={{'fontWeight':'bold',textAlign:"left",underline:"hover"}}>{val.objectName}</td>
                            <td style={{textAlign:"right"}}>{(val.benCount).toLocaleString("en-IN")}</td>
                            <td style={{textAlign:"right"}}>{(val.dbtValue).toLocaleString("en-IN")}</td>
                        </tr>
                    )
                   
                })}
        <tr>
          <td></td>
          <td style={{'fontWeight':'bold'}}>Total</td>
          <td style={{textAlign:"right"}}>{benTotal.toLocaleString("en-IN")}</td>
          <td style={{textAlign:"right"}}>{dbtTotal.toLocaleString("en-IN")}<sub>cr</sub></td>
        </tr>
      </tbody>
    </table> */}
    </div>
    </>
    )
}
export default District
