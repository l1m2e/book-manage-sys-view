<template><el-row style="background-color: #FFFFFF;padding: 20px 0;border-radius: 5px;width: 1200px;margin: 0 auto;">
  <el-row style="padding: 10px;margin: 0 10px;">
    <el-row>
      <el-date-picker style="width: 216px;margin-right: 5px;" @change="fetchFreshData" size="small" v-model="searchTime"
        type="daterange" range-separator="至" start-placeholder="创建开始" end-placeholder="创建结束">
      </el-date-picker>
      <el-input size="small" style="width: 166px;" v-model="newsQueryDto.name" placeholder="书名" clearable
        @clear="handleFilterClear">
        <el-button slot="append" @click="handleFilter" icon="el-icon-search"></el-button>
      </el-input>
      <span style="float: right;" class="edit-button" @click="add()">
        新增新闻
      </span>
    </el-row>
  </el-row>
  <el-row style="margin: 10px 20px;">
    <el-row>
      <el-col style="padding: 2px;border: 1px solid rgb(241,241,241);" v-for="(news, index) in tableData" :key="index"
        :span="4">
        <div class="item-news">
          <div style="display: flex;justify-content: center;">
            <img style="width: 150px;max-height: 180px;border-radius: 5px;" :src="news.cover" alt="" />
          </div>
          <div style="padding: 10px 14px;">
            <div style="color: rgb(51,51,51);font-size: 24px;font-weight: bold;margin-block: 4px;">
              <el-tooltip class="item" effect="dark" :content="news.name" placement="bottom-end">
                <div class="title">{{ news.name }}</div>
              </el-tooltip>
            </div>
            <div style="margin-block: 6px;font-size: 12px;color: rgb(51,51,51);margin-block: 4px;">
              <div class="title" style="margin-block: 8px;">
                <i v-if="news.isPlanBuy" style="margin-right: 5px;" class="el-icon-warning"></i>
                <i v-else style="margin-right: 5px;color: rgb(253, 199, 50);" class="el-icon-success"></i>
                <el-tooltip v-if="news.isPlanBuy" class="item" effect="dark" content="计划上架的新闻，为预售新闻。用户可以订阅，新闻上架之后将做通知"
                  placement="bottom-end">
                  <span style="text-decoration: underline;text-decoration-style: dashed;">预售新闻</span>
                </el-tooltip>
                <span v-else>新闻已上架</span>
                <span> - {{ news.categoryName }}</span>
              </div>
              <div style="font-size: 12px;">
                <el-tooltip class="item" effect="dark" :content="news.publisher" placement="bottom-end">
                  <div class="title">由【{{ news.publisher }}】出版</div>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" :content="news.author" placement="bottom-end">
                  <div class="title" style="margin-block: 10px;">
                    <span style="margin-right: 5px;">作者：{{ news.author }}</span>
                    <span>【库存{{ news.num }}本】</span>
                  </div>
                </el-tooltip>
              </div>
              <div>
                <span @click="handleEdit(news)" class="edit-round">修改</span>
                <span @click="handleDelete(news)" style="margin-left: 4px;" class="edit-round">删除</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-pagination style="margin: 20px 0;float: right;" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[12, 24]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="totalItems"></el-pagination>
  </el-row>
  <el-dialog :show-close="false" :visible.sync="dialogOperation" width="1200px">
    <div slot="title">
      <p class="dialog-title">{{ !isOperation ? "新增新闻" : "修改新闻" }}</p>
    </div>
    <div style="padding:0 20px 40px 15px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="point">新闻封面</div>
          <el-upload class="avatar-uploader" action="/api/news-manage-sys-api/v1.0/file/upload" :show-file-list="false"
            :on-success="handleNewsCoverSuccess">
            <img v-if="cover" :src="cover" class="dialog-cover" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="margin-bottom: 8px;">
            <div class="point">*新闻类别</div>
            <el-select v-model="data.categoryId" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div>
            <div style="margin-bottom: 8px;">
              <div class="point">新闻名称</div>
              <el-input v-model="data.name" placeholder="输入" />
            </div>
            <div style="margin-bottom: 8px;">
              <div class="point">出处</div>
              <el-input v-model="data.publisher" placeholder="输入" />
            </div>
            <div style="margin-bottom: 8px;">
              <div class="point">作者</div>
              <el-input v-model="data.author" placeholder="输入" />
            </div>
            <div>
              <div class="point">新闻简介</div>
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="新闻简介" v-model="data.detail">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <div class="point">新闻内容</div>
            <Editor height="600px" :receiveContent="data.content" @on-receive="receiveData"></Editor>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <span class="channel-button" @click="cannel()">
        取消操作
      </span>
      <span class="edit-button" v-if="!isOperation" @click="addOperation()">
        确定新增
      </span>
      <span class="edit-button" v-else @click="updateOperation()">
        确定修改
      </span>
    </span>
  </el-dialog>
</el-row></template>

<script>
import Editor from "@/components/Editor";
export default {
  components: { Editor },
  data() {
    return {
      data: { num: 1, content: "" },
      currentPage: 1,
      cover: null,
      pageSize: 12,
      totalItems: 0,
      dialogOperation: false, // 开关
      isOperation: false, // 开关-标识新增或修改
      tableData: [],
      delectedRows: [],
      newsQueryDto: {}, // 搜索条件
      options: [],
      newsShelfOptions: [],
      searchTime: []
    };
  },
  created() {
    this.fetchFreshData();
    this.fetchCategory();
    this.fetchNewsshelf();
  },
  methods: {
    receiveData(html) {
      this.data.content = html;
    },
    cannel() {
      this.dialogOperation = false;
      this.isOperation = false;
      this.cover = "";
      this.data = {};
    },
    newsShelfConfig(item) {
      return item.floor + "-" + item.area + "-" + item.frame;
    },
    handleNewsCoverSuccess(res, file) {
      if (res.code !== 200) {
        this.$message.error(`新闻封面上传异常`);
        return;
      }
      this.$message.success(`新闻封面上传成功`);
      this.cover = res.data;
    },
    fetchNewsshelf() {
      this.$axios.post("newsShelf/query", {}).then(res => {
        if (res.data.code === 200) {
          this.newsShelfOptions = res.data.data;
        }
      });
    },
    fetchCategory() {
      this.$axios.post("category/query", {}).then(res => {
        if (res.data.code === 200) {
          this.options = res.data.data;
        }
      });
    },
    // 多选框选中
    handleSelectionChange(selection) {
      this.delectedRows = selection;
    },
    // 批量删除数据
    async batchDelete() {
      if (!this.delectedRows.length) {
        this.$message(`未选中任何数据`);
        return;
      }
      const confirmed = await this.$swalConfirm({
        title: "删除新闻数据",
        text: `删除后不可恢复，是否继续？`,
        icon: "warning"
      });
      if (confirmed) {
        try {
          let ids = this.delectedRows.map(entity => entity.id);
          const response = await this.$axios.post(`/news/batchDelete`, ids);
          if (response.data.code === 200) {
            this.$swal.fire({
              title: "删除提示",
              text: response.data.msg,
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            this.fetchFreshData();
            return;
          }
        } catch (e) {
          this.$swal.fire({
            title: "错误提示",
            text: e,
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
          console.error(`新闻信息删除异常：`, e);
        }
      }
    },
    resetQueryCondition() {
      this.newsQueryDto = {};
      this.fetchFreshData();
    },
    // 修改信息
    async updateOperation() {
      try {
        this.data.cover = this.cover;
        const response = await this.$axios.put("/news/update", this.data);
        this.$swal.fire({
          title: "新闻信息修改",
          text: response.data.msg,
          icon: response.data.code === 200 ? "success" : "error",
          showConfirmButton: false,
          timer: 1000
        });
        if (response.data.code === 200) {
          this.closeDialog();
          this.fetchFreshData();
          this.clearFormData();
        }
      } catch (error) {
        console.error("提交表单时出错:", error);
        this.$message.error("提交失败，请稍后再试！");
      }
    },
    // 信息新增
    async addOperation() {
      try {
        this.data.cover = this.cover;
        const response = await this.$axios.post("/news/save", this.data);
        this.$message[response.data.code === 200 ? "success" : "error"](
          response.data.msg
        );
        if (response.data.code === 200) {
          this.closeDialog();
          this.fetchFreshData();
          this.clearFormData();
        }
      } catch (error) {
        console.error("提交表单时出错:", error);
        this.$message.error("提交失败，请稍后再试！");
      }
    },
    closeDialog() {
      this.dialogOperation = false;
    },
    clearFormData() {
      this.data = {};
      this.cover = null;
    },
    async fetchFreshData() {
      try {
        this.tableData = [];
        let startTime = null;
        let endTime = null;
        if (this.searchTime != null && this.searchTime.length === 2) {
          const [startDate, endDate] = await Promise.all(
            this.searchTime.map(date => date.toISOString())
          );
          startTime = `${startDate.split("T")[0]}T00:00:00`;
          endTime = `${endDate.split("T")[0]}T23:59:59`;
        }
        // 请求参数
        const params = {
          current: this.currentPage,
          size: this.pageSize,
          startTime: startTime,
          endTime: endTime,
          ...this.newsQueryDto
        };
        const response = await this.$axios.post("/news/query", params);
        const { data } = response;
        this.tableData = data.data;
        this.totalItems = data.total;
      } catch (error) {
        console.error("查询新闻信息异常:", error);
      }
    },
    add() {
      this.dialogOperation = true;
    },
    handleFilter() {
      this.currentPage = 1;
      this.fetchFreshData();
    },
    handleFilterClear() {
      this.handleFilter();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchFreshData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchFreshData();
    },
    messagePush(row) {
      this.data = { ...row };
    },
    handleEdit(row) {
      this.dialogOperation = true;
      this.isOperation = true;
      this.data = { ...row };
      this.cover = row.cover;
    },
    handleDelete(row) {
      this.delectedRows.push(row);
      this.batchDelete();
    }
  }
};
</script>
<style scoped lang="scss">
.list-cover {
  width: 50px;
  height: 70px;
  border-radius: 5px;
}

.title {
  width: 140px;
  overflow: hidden;
  /* 隐藏超出部分 */
  text-overflow: ellipsis;
  /* 使用省略号表示超出部分 */
  white-space: nowrap;
  /* 禁止换行 */
}

.input {
  width: 200px;
  padding: 6px;
}

.item-news {
  background-color: rgb(255, 255, 255);
  padding: 10px;
  box-sizing: border-box;
}
</style>
