<script>
	export default {
		globalData: {
			openId: ''
		},
	  onLaunch: async function() {
			const res = await uni.login()
			console.log(res)
			uni.request({
				url: `https://wxappdmm.wyhzs.top/sendreq?code=${res.code}`
			}).then(res => {
				this.globalData.openId = res.data.date.openid
			}).catch(err => {
				console.log(err)
			})
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
