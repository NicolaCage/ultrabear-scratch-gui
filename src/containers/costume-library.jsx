import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import { connect } from 'react-redux'
import analytics from '../lib/analytics';
import costumeLibraryContent from '../lib/libraries/costumes.json';
import LibraryComponent from '../components/library/library.jsx';
import axios from 'axios';

const custumesUrl = "https://assets.ultrabear.com.cn/user";

class CostumeLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelected',
            'getData'
        ]);
        this.state={
            data:{}
        }
    }
    handleItemSelected (item) {
        console.log(item)
        const vmCostume = {
            name: item.name,
            rotationCenterX: item.info[0],
            rotationCenterY: item.info[1],
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.props.vm.addCostume(item.md5, vmCostume);
        analytics.event({
            category: 'library',
            action: 'Select Costume',
            label: item.name
        });
    }
    componentWillMount(){
        this.getData(this.props.id)
    }
    getData(id){
        let config = {
            headers: {
                jwt: this.props.user.jwt,
            }
        }
        axios.get(custumesUrl+"/"+id+"/costumes",config)
        .then(res => {
            if(res.data.code==0) {
                this.setState({
                    data: res.data.data
                })
            }
            else {
                alert('信息失效');
            }
       })
        .catch((error)=> {
            alert("网络错误");
        });
    }
    render () {
        return (
            <LibraryComponent
                data={costumeLibraryContent}
                title="选择造型"
                onItemSelected={this.handleItemSelected}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}
const mapStateToProps = state => ({
    user: state.user
});
CostumeLibrary.propTypes = {
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
    user: PropTypes.any
};
const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user))
});
 export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CostumeLibrary);
