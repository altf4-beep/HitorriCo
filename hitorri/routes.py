from flask import Blueprint, current_app, render_template

from .catalog import get_catalog

bp = Blueprint("main", __name__)


@bp.route("/")
def index():
    cfg = current_app.config
    client_config = {
        "brandName": cfg["BRAND_NAME"],
        "premiumName": cfg["PREMIUM_NAME"],
        "maxFreeCustomGoals": cfg["MAX_FREE_CUSTOM_GOALS"],
        "storageKey": cfg["STORAGE_KEY"],
    }
    return render_template("index.html", catalog=get_catalog(), client_config=client_config)
