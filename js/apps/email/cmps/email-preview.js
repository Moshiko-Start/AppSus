import { emailService } from '../services/email-service.js';
import emailPreviewOpen from './email-preview-open.js';
import longTextBody from './long-text-body.js';
import longTextSubject from './long-text-subject.js';

export default {
	props: ['email'],
	components: {
		emailPreviewOpen,
		longTextBody,
		longTextSubject,
	},
	template: `
        <section>
            <div :class="isUnread" class="email-preview-container" @click="togglePreview">
				<img :src="isStar" class="img img-star" @click="setStar">
                <span :class="isUnread" class="email-to-txt">{{email.emailTo}}</span>
                <div class="preview-body-subject">
                    <long-text-body :email="email"></long-text-body>
                </div>
				<div class="email-preview-stats-container">
					<div class="email-preview-btns-container">
						<img src="img/trash.png" class="img img-preview-remove" @click.stop="removeFromPreview(email.id)" title="Remove Email">
						<img :src="setImgUrl" class="img img-preview-read" @click.stop=toggleRead title="Read/Unread">
					</div>
					<span :class="isUnread" class="email-sent-at">{{showTime}}</span>
				</div>
            </div>
            <email-preview-open :email="email" v-if="openPreview" @remove="removeEmail" @showDetails = "showDetails"/>
        </section>
    `,
	data() {
		return {
			openPreview: false,
			emailCopy: this.email,
		};
	},
	methods: {
		togglePreview() {
			this.openPreview = !this.openPreview;
			this.readEmail();
		},
		removeEmail(emailId) {
			this.openPreview = false;
			this.$emit('remove', emailId);
		},
		removeFromPreview(emailId) {
			emailService.remove(emailId).then(() => {
				this.openPreview = false;
				this.$emit('remove', emailId);
			});
		},
		readEmail() {
			this.emailCopy.isRead = true;
			emailService.update(this.emailCopy).then(() => {
				this.$emit('read');
			});
		},
		toggleRead() {
			this.emailCopy.isRead = !this.emailCopy.isRead;
			emailService.update(this.emailCopy).then(() => {
				this.$emit('read');
			});
		},
		showDetails() {
			this.$emit('showDetails');
		},
		setStar(ev) {
			ev.stopPropagation();
			this.email.isStar = !this.email.isStar;
			emailService.update(this.email).then(() => {
				this.$emit('star');
			});
		},
	},
	computed: {
		showTime() {
			let time = this.email.sentAt;
			time = new Date(time);
			let hour = time.getHours();
			let minutes = time.getMinutes();

			if (hour < 10) hour = '0' + hour;
			if (minutes < 10) minutes = '0' + minutes;

			time = `${hour}:${minutes}`;
			if (hour > 12) return time + ' PM';
			return time + ' AM';
		},
		isUnread() {
			return {
				unread: !this.emailCopy.isRead,
				read: this.emailCopy.isRead,
			};
		},
		isStar() {
			if (this.emailCopy.isStar) {
				return 'img/starYellow.png';
			} else {
				return 'img/starEmpty.png';
			}
		},
		setImgUrl() {
			if (this.emailCopy.isRead) {
				return 'img/read-mail.png';
			}
			return 'img/unread.png';
		},
	},
};
