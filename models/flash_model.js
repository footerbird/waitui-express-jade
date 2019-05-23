var flash={
    //获取快讯列表
    get_flashList: 'select * from flash_info order by create_time desc limit ?,?',
}

module.exports=flash;