import { emailService } from '../services/email-service.js';
import { eventBus } from '../../../services/event-bus-service.js';

export default {
	props: ['emailSubject', 'emailAddress', 'body', 'subject'],
	template: `
    <section class="compose-wrapper">
        <header class="compose-header-container">
            <h3 class="compose-header">New Message</h3>
            <button class="btn btn-close-compose" @click="closeCompose" title="Close">X</button>
        </header>
        <main class="compose-body-container">
            <div class="compose-properties">
                <div class="compose-container">
                    <span class="compose-to">To:</span>
					<input type="text" v-if="emailAddress" :value="emailAddress">
                    <input type="text" v-else v-model="email.emailTo"/>
                </div>
                <div class="compose-container">
                    <span class="compose-cc">Cc:</span>
                    <input type="text" v-model="email.emailCc"/>
                </div>
                <div class="compose-container">
                    <span class="compose-bcc">Bcc:</span>
                    <input type="text" v-model="email.emailBcc"/>
                </div>
                <div class="compose-container">
                    <span class="compose-subject">Subject</span>
					<input type="text" v-if="emailSubject" :value="'RE: ' + emailSubject" >
                    <input type="text" v-else v-model="email.emailSubject"/>
                </div>
            </div>
			<div class="txt-properties-container">
				<img src="img/underline.png" class="img img-underline" @click="setUnderline" title="Underline">
				<img src="img/bold.png" class="img img-bold" @click="setBold" title="Bold">
				<img src="img/italic.png" class="img img-italic" @click="setItalic" title="Italic">
				<input type="color" class="txt-color-pick" @input="setColor" ref="txtColor" title="Text Color">
				<img src="img/rtl.png" class="img img-rtl" @click="setRtl" title="Change Text Direction">
			</div>
            <div class="compose-txt-area-container">
				<textarea v-if="body" cols="30" rows="30" class="compose-txt" v-model="email.emailBody" :class="setStyle" :style="{color: txtColor}"></textarea>
                <textarea v-else cols="30" rows="30" class="compose-txt" v-model="email.emailBody" :class="setStyle" :style="{color: txtColor}"></textarea>
            </div>
        </main>
        <footer class="compose-footer-container">
            <router-link to="/mail/inbox">
				<button class="btn compose-btn-send" @click="sendEmail">Send</button>
			</router-link>
            <button class="btn compose-btn-erase" @click="eraseCompose">
                <img src="img/trash.png" class="img compose-erase-img">
            </button>
        </footer>
    </section>
    `,
	data() {
		return {
			email: {
				emailTo: '',
				emailFrom: true,
				isStar: false,
				emailCc: '',
				emailBcc: '',
				emailSubject: '',
				emailBody: '',
				isRead: false,
				sentAt: '',
			},
			isUnderline: false,
			isBold: false,
			isItalic: false,
			isLtr: true,
			isRtl: false,
			txtColor: '000000',
		};
	},
	methods: {
		closeCompose() {
			this.$emit('closeCompose');
			if (this.body || this.subject) {
				this.clearUrl();
			}
			this.eraseCompose();
		},
		sendEmail() {
			if (!this.email.emailTo) {
				const msg = {
					txt: 'Error, missing information',
					type: 'error',
				};
				eventBus.$emit('show-msg', msg);
				return;
			}
			emailService
				.create(this.email)
				.then(() => {
					this.$emit('send');
					this.closeCompose();
				})
				.then(() => {
					const msg = {
						txt: 'Sent successfuly',
						type: 'success',
					};
					eventBus.$emit('show-msg', msg);
				})
				.catch((err) => {
					const msg = {
						txt: 'Error, missing information',
						type: 'error',
					};
					eventBus.$emit('show-msg', msg);
				});
		},
		clearUrl() {
			this.$router.push({ path: 'inbox', query: {} });
		},
		eraseCompose() {
			this.email = {
				emailTo: '',
				emailCc: '',
				emailBcc: '',
				emailSubject: '',
				emailBody: '',
				isRead: true,
				emailFrom: true,
				sentAt: '',
			};
		},
		setUnderline() {
			this.isUnderline = !this.isUnderline;
		},
		setBold() {
			this.isBold = !this.isBold;
		},
		setItalic() {
			this.isItalic = !this.isItalic;
		},
		setRtl() {
			this.isRtl = !this.isRtl;
		},
		setColor() {
			this.txtColor = this.$refs.txtColor.value;
		},
	},
	computed: {
		setStyle() {
			return {
				'txt-underline': this.isUnderline,
				'txt-bold': this.isBold,
				'txt-italic': this.isItalic,
				'txt-rtl': this.isRtl,
			};
		},
	},
	created() {
		this.email.emailSubject = this.emailSubject;
		this.email.emailTo = this.emailAddress;
		if (this.body) this.email.emailBody = this.body;
		if (this.subject) this.email.emailSubject = this.subject;
	},
};
