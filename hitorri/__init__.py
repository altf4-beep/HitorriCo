import os

from flask import Flask

from .config import Config


def create_app(config_object=Config):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app = Flask(
        __name__,
        static_folder=os.path.join(root, "public", "static"),
        static_url_path="/static",
    )
    app.config.from_object(config_object)

    from .routes import bp

    app.register_blueprint(bp)

    @app.context_processor
    def inject_brand():
        return {
            "brand": {
                "name": app.config["BRAND_NAME"],
                "short": app.config["BRAND_SHORT"],
                "premium": app.config["PREMIUM_NAME"],
                "tagline": app.config["TAGLINE"],
            }
        }

    return app
