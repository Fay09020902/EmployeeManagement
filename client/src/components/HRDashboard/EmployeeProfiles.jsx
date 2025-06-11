import { useEffect } from "react"
import {fetchEmployees, getEmployeeProfileById} from '../../features/employee'
import { useDispatch, useSelector } from 'react-redux';

const EmployeeProfiles = () => {
    const dispatch = useDispatch();
     const { error, employees, loading} = useSelector((state) => state.employee);

    useEffect(() => {
        dispatch(fetchEmployees())
    }, [dispatch]);

    const approvedEmployees = employees?.filter(emp => emp.onboardingStatus === 'approved') || [];

    if(loading) {
        return (<div>Loading</div>)
    }

    return (
        <div>
         {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
 }

 export default EmployeeProfiles
