
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

function Footer() {
    return (
        <footer className="footer" id="about">
            <div className="container footer-inner">

                <div className="footer-brand">
                    <Link to="/" className="nav-logo">
                        <BookOpen size={24} />
                        <span>
                            Dynamic<span className="logo-accent">Blog.</span>
                        </span>
                    </Link>

                    <p>
                        Your stories. Your space. Discover ideas,
                        perspectives and stories that matter.
                    </p>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {new Date().getFullYear()} Dynamic Blog. All rights reserved.
                    </p>
                    <span>Made with passion.</span>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
